use candid::candid_method;
use ic_cdk_macros::{self, update, query, pre_upgrade, post_upgrade, heartbeat};
use std::str::FromStr;
use std::cell::{Cell, RefCell};
use ic_cdk::export::{Principal};
use ic_cdk::{storage};
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
    pub static FETCHER: RefCell<Fetcher> = RefCell::default();
    pub static SUBSCRIPTIONS: RefCell<Vec<Subscription>> = RefCell::default();

    pub static CHAIN_ID: RefCell<u64> = RefCell::default();
    pub static RPC: RefCell<String> = RefCell::default();
}

// #[pre_upgrade]
// fn pre_upgrade() {
//     // save states
//
//     FETCHER.with(|fetcher| storage::stable_save((fetcher,)).unwrap());
// }
//
// #[post_upgrade]
// fn post_upgrade() {
//     // restore states
//
//     let (old_fetcher,): (Fetcher,) = storage::stable_restore().unwrap();
//
//     FETCHER.with(|fetcher| {
//         let new_fetcher = Fetcher::new(old_fetcher.endpoints, old_fetcher.frequency);
//
//         *fetcher.borrow_mut() = new_fetcher;
//     });
// }

#[update]
async fn get_address() -> Result<String, String> {
    let canister_addr = get_eth_addr(None, None, KEY_NAME.to_string())
        .await
        .map_err(|e| format!("get canister eth addr failed: {}", e))?;

    Ok(hex::encode(canister_addr))
}

#[update]
async fn setup(endpoints: Vec<Endpoint>, frequency: u64, chain_id: u64, rpc: String) -> Result<(), String> {
    let fetcher = Fetcher::new(endpoints, frequency);

    FETCHER.with(|f| {
        *f.borrow_mut() = fetcher;
    });
    CHAIN_ID.with(|c| {
        *c.borrow_mut() = chain_id;
    });
    RPC.with(|r| {
        *r.borrow_mut() = rpc;
    });

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

    ic_cdk::println!("subscribe: {:?}", subscription);

    SUBSCRIPTIONS.with(|subscriptions| {
        subscriptions.borrow_mut().push(subscription);
    });

    "Ok".to_string()
}

fn main() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
