use candid::candid_method;
use ic_cdk_macros::{self, update, query, pre_upgrade, post_upgrade, heartbeat, init};
use std::str::FromStr;
use std::cell::{Cell, RefCell};
use ic_cdk::export::{
    Principal,
    serde::{Deserialize, Serialize},
    candid::CandidType,
};
use hex::FromHex;
use time::{OffsetDateTime};
use serde_json::{json};
use ic_cdk::{storage, timer::{TimerId}};
use futures::future::join_all;
use canistergeek_ic_rust::{
    logger::{log_message},
    monitor::{collect_metrics},
};

use ic_web3::transports::ICHttp;
use ic_web3::Web3;
use ic_web3::ic::{get_eth_addr, KeyInfo};
use ic_web3::{
    contract::{Contract, Options},
    ethabi::ethereum_types::{U64, U256},
    types::{Address, TransactionParameters, BlockId, BlockNumber},
};
use siwe::{Message, VerificationOpts};

mod fetcher;
use fetcher::{Fetcher, Endpoint};
mod pubsub;
mod http;
mod processing;
mod queries;
mod logger;

use pubsub::Subscription;

// url: "https://api.pro.coinbase.com/products/ICP-USD/stats".to_string(),
// resolver: "last".to_string(),
// url: "https://api.pro.coinbase.com/products/BTC-USD/stats".to_string(),
// resolver: "last".to_string(),

// const URL: &str = "https://eth-goerli.g.alchemy.com/v2/qrm39CebFg7x-b4I4XhJO4e2AocKXpNx";
// const CHAIN_ID: u64 = 5;
const KEY_NAME: &str = "dfx_test_key";
// const KEY_NAME: &str = "key_1";
const ABI: &[u8] = include_bytes!("./contracts/icp_price_abi.json");
// const CONTRACT_ADDRESS: &str = "0xCFf00E5f685cCE94Dfc6d1a18200c764f9BCca1f";

type Result<T, E> = std::result::Result<T, E>;

thread_local! {
    pub static TIMER_ID: RefCell<TimerId> = RefCell::default();

    pub static FETCHER: RefCell<Fetcher> = RefCell::default();
    pub static SUBSCRIPTIONS: RefCell<Vec<Subscription>> = RefCell::default();

    pub static CHAIN_ID: RefCell<u64> = RefCell::default();
    pub static RPC: RefCell<String> = RefCell::default();

    pub static FACTORY_ADDRESS: RefCell<String> = RefCell::default();
}

#[derive(Debug, CandidType, Serialize, Deserialize)]
struct InitPayload {
    endpoints: Vec<Endpoint>,
    frequency: u64,
    chain_id: u64,
    rpc: String,
}

fn map_subscriptions_to_show(subscriptions: Vec<Subscription>) -> Vec<(String, String)> {
    subscriptions.iter().map(|s| (s.contract_address.clone(), s.method.clone())).collect::<Vec<(String, String)>>()
}

#[pre_upgrade]
fn pre_upgrade() {
    // save states

    let fetcher = FETCHER.with(|fetcher| fetcher.take());
    let subscriptions = SUBSCRIPTIONS.with(|subscriptions| subscriptions.take());
    let chain_id = CHAIN_ID.with(|chain_id| chain_id.take());
    let rpc = RPC.with(|rpc| rpc.take());
    let factory_address = FACTORY_ADDRESS.with(|factory_address| factory_address.take());

    // monitoring
    let monitor_stable_data = canistergeek_ic_rust::monitor::pre_upgrade_stable_data();
    let logger_stable_data = canistergeek_ic_rust::logger::pre_upgrade_stable_data();

    ic_cdk::println!(
        "!pre_upgrade: fetcher: {:?}, subscriptions: {:?}, chain_id: {:?}, rpc: {:?}, factory_address: {:?}",
        fetcher,
        map_subscriptions_to_show(subscriptions.clone()),
        chain_id,
        rpc,
        factory_address,
    );
    log_message(
        format!(
            "pre_upgrade fetcher: {:?}, subscriptions: {:?}, chain_id: {:?}, rpc: {:?}, factory_address: {:?}",
            fetcher,
            map_subscriptions_to_show(subscriptions.clone()),
            chain_id,
            rpc,
            factory_address
        )
    );

    storage::stable_save((fetcher, subscriptions, chain_id, rpc, factory_address, monitor_stable_data, logger_stable_data)).expect("failed to save to stable storage");
}

#[post_upgrade]
fn post_upgrade() {
    // restore states

    let (fetcher, subscriptions, chain_id, rpc, factory_address, monitor_stable_data, logger_stable_data,):
        (Fetcher, Vec<Subscription>, u64, String, String, canistergeek_ic_rust::monitor::PostUpgradeStableData, canistergeek_ic_rust::logger::PostUpgradeStableData)
        = storage::stable_restore().expect("failed to restore from stable storage");

    ic_cdk::println!(
        "post_upgrade: fetcher: {:?}, subscriptions: {:?}, chain_id: {:?}, rpc: {:?}, factory_address: {:?}",
        fetcher,
        map_subscriptions_to_show(subscriptions.clone()),
        chain_id,
        rpc,
        factory_address,
    );
    log_message(
        format!(
            "post_upgrade fetcher: {:?}, subscriptions: {:?}, chain_id: {:?}, rpc: {:?}, factory_address: {:?}",
            fetcher,
            map_subscriptions_to_show(subscriptions.clone()),
            chain_id,
            rpc,
            factory_address
        )
    );

    // monitoring
    canistergeek_ic_rust::monitor::post_upgrade_stable_data(monitor_stable_data);
    canistergeek_ic_rust::logger::post_upgrade_stable_data(logger_stable_data);

    FETCHER.with(|f| f.replace(fetcher));
    SUBSCRIPTIONS.with(|s| s.replace(subscriptions));
    CHAIN_ID.with(|c| c.replace(chain_id));
    RPC.with(|r| r.replace(rpc));
    FACTORY_ADDRESS.with(|f| f.replace(factory_address));
}

#[update]
async fn get_address() -> Result<String, String> {
    let canister_addr = get_eth_addr(None, None, KEY_NAME.to_string())
        .await
        .map_err(|e| format!("get canister eth addr failed: {}", e))?;

    Ok(hex::encode(canister_addr))
}

#[init]
async fn init(payload: Option<InitPayload>) {
    ic_cdk::println!("init");
    log_message("init".to_string());

    if let Some(payload) = payload {
        ic_cdk::println!("init: payload: {:?}", payload);
        log_message(format!("init: payload: {:?}", payload));

        init_candid(payload).await.expect("init_candid failed");
    }
}

#[update]
async fn init_candid(payload: InitPayload) -> Result<(), String> {
    let fetcher = Fetcher::new(payload.endpoints.clone(), payload.frequency.clone());

    FETCHER.with(|f| f.replace(fetcher));
    CHAIN_ID.with(|c| c.replace(payload.chain_id));
    RPC.with(|r| r.replace(payload.rpc.clone()));
    FACTORY_ADDRESS.with(|c| c.replace(ic_cdk::caller().to_text()));

    ic_cdk::println!("init: endpoints: {:?}, frequency: {:?}, chain_id: {:?}, rpc: {:?}", payload.endpoints, payload.frequency, payload.chain_id, payload.rpc);
    log_message(format!("init: endpoints: {:?}, frequency: {:?}, chain_id: {:?}, rpc: {:?}", payload.endpoints, payload.frequency, payload.chain_id, payload.rpc));

    Ok(())
}

#[update]
fn start() -> Result<(), String> {
    ic_cdk::println!("oracle start");
    log_message("oracle start".to_string());
    collect_metrics();

    FETCHER.with(|fetcher| {
        let f = fetcher.borrow().clone();

        f.start();
    });

    Ok(())
}

#[update]
async fn stop_fetcher() -> String {
    log_message("stop_fetcher".to_string());

    FETCHER.with(|fetcher| fetcher.take().stop());

    "Ok".to_string()
}

#[update]
async fn verify_address(siwe_msg: String, siwe_sig: String) -> Result<(String,String),String> {
    let opts = VerificationOpts {
        domain: None,
        nonce: None,
        timestamp: Some(OffsetDateTime::from_unix_timestamp((ic_cdk::api::time() / (1000 * 1000 * 1000)) as i64).unwrap())
    };

    let msg = Message::from_str(&siwe_msg).map_err(|e| e.to_string())?;
    let sig = <[u8; 65]>::from_hex(siwe_sig).map_err(|e| e.to_string())?;

    ic_cdk::println!("validate_address: msg: {:?}, sig: {:?}", msg, sig);

    // Check if uri is equal to the caller
    // msg.uri.to_string().eq(&format!("did:icp:{}",&caller.to_string())).then(|| ()).ok_or("Invoked by unauthorized principal")?;

    // Check if target (canister and method) is part of authorized resources
    // let target = format!("icp:{}/{}",canister.to_string(), method_name);
    // msg.resources.clone().into_iter().find(|r| r.as_str().eq(&target)).ok_or(format!("Unauthorized for resource: {}", &target))?;

    msg.verify(&sig, &opts).await.map_err(|e| e.to_string())?;

    let factory_addr = FACTORY_ADDRESS.with(|f| Principal::from_text(f.borrow().clone()).unwrap());

    let canister_addr = get_eth_addr(Some(factory_addr), Some(vec![msg.address.to_vec()]), KEY_NAME.to_string())
        .await
        .map_err(|e| format!("get canister eth addr failed: {}", e))?;

    Ok((
        hex::encode(msg.address),
        hex::encode(canister_addr)
    ))
}

#[update]
async fn subscribe(contract_address: String, method: String) -> String {
    // verification

    let subscription = Subscription {
        contract_address,
        abi: ABI.to_vec(),
        method,
    };

    SUBSCRIPTIONS.with(|subscriptions| {
        subscriptions.borrow_mut().push(subscription);

        ic_cdk::println!("subscriptions: {:?}", map_subscriptions_to_show(subscriptions.borrow().clone()));
        log_message(format!("subscriptions: {:?}", map_subscriptions_to_show(subscriptions.borrow().clone())));
    });

    "Ok".to_string()
}

#[update]
async fn update_price_manual(contract_address: String, method: String, price: f64) -> String {
    pubsub::update_price(contract_address, method, ABI, price).await.expect("Update price failed");

    "Ok".to_string()
}

#[update]
async fn set_factory_address(address: String) -> String {
    FACTORY_ADDRESS.with(|f| f.replace(address));

    "Ok".to_string()
}

fn main() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
