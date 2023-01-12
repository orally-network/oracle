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

// todo: make rpc and chain_id settable on oracle creating stage
const URL: &str = "https://eth-goerli.g.alchemy.com/v2/qrm39CebFg7x-b4I4XhJO4e2AocKXpNx";
const CHAIN_ID: u64 = 5;
const KEY_NAME: &str = "dfx_test_key";
const ABI: &[u8] = include_bytes!("./contracts/icp_price_abi.json");
const CONTRACT_ADDRESS: &str = "0xCFf00E5f685cCE94Dfc6d1a18200c764f9BCca1f";

type Result<T, E> = std::result::Result<T, E>;

thread_local! {
    pub static FETCHER: RefCell<Fetcher> = RefCell::default();
    pub static SUBSCRIPTIONS: RefCell<Vec<Subscription>> = RefCell::default();

    pub static FETCH_COUNTER: RefCell<usize> = RefCell::new(0);
}

#[update]
fn init() {
    // init fetcher
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
async fn setup() {}

#[update(name = "start_fetcher")]
#[candid_method(update, rename = "start_fetcher")]
async fn start_fetcher() -> String {
    let fetcher = Fetcher::new(
        vec![
            Endpoint {
                url: "https://api.pro.coinbase.com/products/ICP-USD/stats".to_string(),
                resolver: "last".to_string(),
            },
            Endpoint {
                url: "https://api.pro.coinbase.com/products/BTC-USD/stats".to_string(),
                resolver: "last".to_string(),
            },
        ],
        30,
    );

    FETCHER.with(|f| {
        *f.borrow_mut() = fetcher;
    });

    "Ok".to_string()
}

#[update(name = "stop_fetcher")]
#[candid_method(update, rename = "stop_fetcher")]
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
async fn subscribe(contract_address: String) -> String {
    let subscription = Subscription {
        contract_address,
        abi: ABI.to_vec(),
        method: "set_price".to_string(),
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
