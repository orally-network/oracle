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

mod price_fetcher;
mod evm_interaction;
mod exchange_rate_canister;
mod queries;
mod asset_data_store;

thread_local! {
    // pub static CHAINS: RefCell<Chains> = RefCell::new(Chains(HashMap::new()));
    
    pub static EXCHANGE_RATE_CANISTER_PRINCIPAL: RefCell<Principal> = RefCell::new(
        Principal::from_text("YOUR_CANISTER_PRINCIPAL").unwrap_or_else(|_| {
            panic!("Invalid canister principal: {}", "YOUR_CANISTER_PRINCIPAL");
        })
    );
}

#[init]
fn init() {
}

#[update]
pub fn set_exchange_rate_canister_principal(new_principal: String) {
    EXCHANGE_RATE_CANISTER_PRINCIPAL.with(|principal| {
        *principal.borrow_mut() = Principal::from_text(&new_principal).unwrap_or_else(|_| {
            panic!("Invalid canister principal: {}", new_principal);
        })
    });
}

fn main() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
