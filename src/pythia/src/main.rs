use ic_cdk::export::{
    candid,
    Principal,
};
use ic_cdk::{
    timer::{clear_timer, set_timer_interval, TimerId},
};
use ic_cdk_macros::{self, update, query, init};

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

use crate::types::{Chains, Chain, Subscription};

mod types;
mod migrations;
mod chains;
mod utils;
mod notify;
mod subscription;

thread_local! {
    pub static CHAINS: RefCell<Chains> = RefCell::default();
    pub static OWNER: RefCell<String> = RefCell::default();
}

#[init]
fn init() {
    OWNER.with(|owner| {
        *owner.borrow_mut() = ic_cdk::caller().to_string();
    });
}

fn main() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
