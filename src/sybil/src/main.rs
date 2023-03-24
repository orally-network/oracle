use ic_cdk::export::{
    candid,
    Principal,
};
use ic_cdk::{
    timer::{clear_timer, set_timer_interval, TimerId},
};
use ic_cdk_macros::{self, update, query, init, import};
use std::collections::HashMap;

use ic_web3::{
    contract::{Contract, Options},
    ethabi::ethereum_types::{U64, U256},
    types::{Address, TransactionParameters, BlockId, BlockNumber},
    transports::{ICHttp},
    Web3,
    ic::{get_eth_addr, KeyInfo},
    futures::TryFutureExt,
};

use canistergeek_ic_rust::{
    logger::{log_message},
    monitor::{collect_metrics},
};

use std::cell::{RefCell};
use std::time::Duration;
use orally_shared;

use types::{};
mod types;

thread_local! {
    pub static CHAINS: RefCell<Chains> = RefCell::new(Chains(HashMap::new()));
}

#[init]
fn init() {
}

fn main() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
