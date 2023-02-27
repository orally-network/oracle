use ic_cdk::export::candid;
use ic_cdk_macros::{self, update, query, init};

use canistergeek_ic_rust::{
    logger::{log_message},
    monitor::{collect_metrics},
};

use std::cell::{RefCell};

use crate::types::Subscriptions;

mod types;
mod migrations;

thread_local! {
    pub static SUBSCRIPTIONS: RefCell<Subscriptions> = RefCell::default();
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
