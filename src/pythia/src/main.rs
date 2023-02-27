use ic_cdk::export::{
    candid,
    Principal,
};
use ic_cdk::{
    timer::{clear_timer, set_timer_interval, TimerId},
};
use ic_cdk_macros::{self, update, query, init};

use canistergeek_ic_rust::{
    logger::{log_message},
    monitor::{collect_metrics},
};

use std::cell::{RefCell};
use std::time::Duration;

use crate::types::{Chains, Chain, Subscription};

mod types;
mod migrations;
mod chains;
mod utils;
mod notify;

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
