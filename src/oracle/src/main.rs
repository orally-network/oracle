use candid::candid_method;
use ic_cdk_macros::{self, update, query, pre_upgrade, post_upgrade, heartbeat, init};
use std::str::FromStr;
use std::cell::{Cell, RefCell};
use ic_cdk::export::{
    Principal,
    serde::{Deserialize, Serialize},
    candid::CandidType,
};
use ic_cdk::{storage, timer::{TimerId}};
use futures::future::join_all;

use ic_web3::transports::ICHttp;
use ic_web3::Web3;
use ic_web3::ic::{get_eth_addr, KeyInfo};
use ic_web3::{
    contract::{Contract, Options},
    ethabi::ethereum_types::{U64, U256},
    types::{Address, TransactionParameters, BlockId, BlockNumber},
};

mod fetcher;
use fetcher::{Fetcher, Endpoint};
mod pubsub;
mod http;
mod processing;

use pubsub::Subscription;

// url: "https://api.pro.coinbase.com/products/ICP-USD/stats".to_string(),
// resolver: "last".to_string(),
// url: "https://api.pro.coinbase.com/products/BTC-USD/stats".to_string(),
// resolver: "last".to_string(),

// todo: make rpc and chain_id settable on oracle creating stage
// const URL: &str = "https://eth-goerli.g.alchemy.com/v2/qrm39CebFg7x-b4I4XhJO4e2AocKXpNx";
// const CHAIN_ID: u64 = 5;
const KEY_NAME: &str = "dfx_test_key";
const ABI: &[u8] = include_bytes!("./contracts/icp_price_abi.json");
// const CONTRACT_ADDRESS: &str = "0xCFf00E5f685cCE94Dfc6d1a18200c764f9BCca1f";

type Result<T, E> = std::result::Result<T, E>;

thread_local! {
    pub static TIMER_ID: RefCell<TimerId> = RefCell::default();

    pub static FETCHER: RefCell<Fetcher> = RefCell::default();
    pub static SUBSCRIPTIONS: RefCell<Vec<Subscription>> = RefCell::default();

    pub static CHAIN_ID: RefCell<u64> = RefCell::default();
    pub static RPC: RefCell<String> = RefCell::default();
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

    ic_cdk::println!(
        "!pre_upgrade: fetcher: {:?}, subscriptions: {:?}, chain_id: {:?}, rpc: {:?}",
        fetcher,
        map_subscriptions_to_show(subscriptions.clone()),
        chain_id,
        rpc,
    );

    storage::stable_save((fetcher, subscriptions, chain_id, rpc)).expect("failed to save to stable storage");
}

#[post_upgrade]
fn post_upgrade() {
    // restore states

    let (fetcher, subscriptions, chain_id, rpc,): (Fetcher, Vec<Subscription>, u64, String,) = storage::stable_restore().expect("failed to restore from stable storage");

    ic_cdk::println!(
        "post_upgrade: fetcher: {:?}, subscriptions: {:?}, chain_id: {:?}, rpc: {:?}",
        fetcher,
        map_subscriptions_to_show(subscriptions.clone()),
        chain_id,
        rpc,
    );

    FETCHER.with(|f| f.replace(fetcher));
    SUBSCRIPTIONS.with(|s| s.replace(subscriptions));
    CHAIN_ID.with(|c| c.replace(chain_id));
    RPC.with(|r| r.replace(rpc));
}

#[update]
async fn get_address() -> Result<String, String> {
    let canister_addr = get_eth_addr(None, None, KEY_NAME.to_string())
        .await
        .map_err(|e| format!("get canister eth addr failed: {}", e))?;

    Ok(hex::encode(canister_addr))
}

#[init]
fn init(payload: Option<InitPayload>) {
    ic_cdk::println!("init");

    if let Some(payload) = payload {
        ic_cdk::println!("init: payload: {:?}", payload);

        init_candid(payload);
    }
}

#[update]
async fn init_candid(payload: InitPayload) -> Result<(), String> {
    let fetcher = Fetcher::new(payload.endpoints.clone(), payload.frequency.clone());

    FETCHER.with(|f| f.replace(fetcher));
    CHAIN_ID.with(|c| c.replace(payload.chain_id));
    RPC.with(|r| r.replace(payload.rpc.clone()));

    ic_cdk::println!("init: endpoints: {:?}, frequency: {:?}, chain_id: {:?}, rpc: {:?}", payload.endpoints, payload.frequency, payload.chain_id, payload.rpc);

    Ok(())
}

#[update]
fn setup() -> Result<(), String> {
    ic_cdk::println!("setup");

    FETCHER.with(|f| f.take().start());

    Ok(())
}

#[update]
async fn stop_fetcher() -> String {
    FETCHER.with(|fetcher| {
        let f = fetcher.borrow().clone();

        f.stop();

        *fetcher.borrow_mut() = Fetcher::default();
    });

    "Ok".to_string()
}

#[update(name = "subscribe")]
#[candid_method(update, rename = "subscribe")]
async fn subscribe(contract_address: String, method: String) -> String {
    let subscription = Subscription {
        contract_address,
        abi: ABI.to_vec(),
        method,
    };

    SUBSCRIPTIONS.with(|subscriptions| {
        subscriptions.borrow_mut().push(subscription);

        ic_cdk::println!("subscriptions: {:?}", map_subscriptions_to_show(subscriptions.borrow().clone()));
    });

    "Ok".to_string()
}

fn main() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
