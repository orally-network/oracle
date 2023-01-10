use candid::candid_method;
use ic_cdk_macros::{self, update, query, pre_upgrade, post_upgrade, heartbeat};
use std::str::FromStr;
use std::cell::{Cell, RefCell};
use ic_cdk::export::{Principal};
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

const URL: &str = "https://eth-goerli.g.alchemy.com/v2/bUH5A9MJ6basJ88Hq85y23Ada8CYSvD4";
const CHAIN_ID: u64 = 5;
const KEY_NAME: &str = "dfx_test_key";
const TOKEN_ABI: &[u8] = include_bytes!("./contracts/icp_price_abi.json");
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

#[pre_upgrade]
fn pre_upgrade() {
    // STATE.with(|s| {
    //     ic_cdk::storage::stable_save((s,)).unwrap();
    // });

    // save states
}

#[post_upgrade]
fn post_upgrade() {
    // let (s_prev,): (State,) = ic_cdk::storage::stable_restore().unwrap();
    // STATE.with(|s| {
    //     *s.borrow_mut() = s_prev;
    // });

    // restore states
    // init fetcher
}

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

#[update(name = "update_price")]
#[candid_method(update, rename = "update_price")]
async fn update_price() -> Result<String, String> {
    // ecdsa key info
    let derivation_path = vec![ic_cdk::id().as_slice().to_vec()];
    let key_info = KeyInfo{ derivation_path: derivation_path, key_name: KEY_NAME.to_string() };

    let w3 = match ICHttp::new(URL, None, None) {
        Ok(v) => { Web3::new(v) },
        Err(e) => { return Err(e.to_string()) },
    };
    let contract_address = Address::from_str(&CONTRACT_ADDRESS).unwrap();
    let contract = Contract::from_json(
        w3.eth(),
        contract_address,
        TOKEN_ABI
    ).map_err(|e| format!("init contract failed: {}", e))?;

    let canister_addr = get_eth_addr(None, None, KEY_NAME.to_string())
        .await
        .map_err(|e| format!("get canister eth addr failed: {}", e))?;

    ic_cdk::println!("canister_addr: {}", canister_addr);

    // add nonce to options
    let tx_count = w3.eth()
        .transaction_count(canister_addr, None)
        .await
        .map_err(|e| format!("get tx count error: {}", e))?;
    // get gas_price
    let gas_price = w3.eth()
        .gas_price()
        .await
        .map_err(|e| format!("get gas_price error: {}", e))?;
    // legacy transaction type is still ok
    let options = Options::with(|op| {
        op.nonce = Some(tx_count);
        op.gas_price = Some(gas_price);
        op.transaction_type = Some(ic_web3::ethabi::ethereum_types::U64::from(2)) //EIP1559_TX_ID
    });

    let price: String = "10".to_string();

    ic_cdk::println!("Price from oracle: {}", price);

    let txhash = contract
        .signed_call("set_price", (price,), options, hex::encode(canister_addr), key_info, CHAIN_ID)
        .await
        .map_err(|e| format!("token transfer failed: {}", e))?;

    ic_cdk::println!("txhash: {}", hex::encode(txhash));

    Ok(format!("{}", hex::encode(txhash)))
}

fn main() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
