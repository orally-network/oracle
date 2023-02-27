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
mod migrations;

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

    FETCHER.with(|fetcher| {
        let f = fetcher.borrow().clone();

        f.stop();
    });

    "Ok".to_string()
}

// #[update]
// async fn update_price_manual(contract_address: String, method: String, price: f64) -> String {
//     let subscription = Subscription {
//         contract_address: Address::from_str(&contract_address).unwrap(),
//         method: method.clone(),
//         abi: Vec::from(ABI),
//         owner_address: ,
//         execution_address: ,
//         active: true,
//         last_execution: 0,
//     };
//
//     pubsub::update_price(contract_address, method, ABI, price).await.expect("Update price failed");
//
//     "Ok".to_string()
// }

#[update]
async fn update_timer(frequency: u64) -> String {
    ic_cdk::println!("update_timer: {:?}", frequency);
    log_message(format!("update_timer: {:?}", frequency));

    FETCHER.with(|fetcher| {
        let f = fetcher.borrow().clone();
        
        let new_fetcher = f.update_timer(frequency);
        
        fetcher.replace(new_fetcher);
    });

    "Ok".to_string()
}

#[update]
async fn clear_subscriptions() -> String {
    ic_cdk::println!("clear_subscriptions");
    log_message("clear_subscriptions".to_string());

    SUBSCRIPTIONS.with(|subscriptions| {
        let mut s = subscriptions.borrow_mut();

        s.clear();
    });

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
