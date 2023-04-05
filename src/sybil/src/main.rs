extern crate core;

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

use types::{Chain, Chains, Pair, Pairs, CustomPair, CustomPairs};
use state::{STATE, State};
mod types;

mod price_fetcher;
mod evm_interaction;
mod exchange_rate_canister;
mod asset_data_store;
mod state;

#[init]
fn init() {
    STATE.with(|state| {
        *state.borrow_mut() = State::new();
    });
}

fn main() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
