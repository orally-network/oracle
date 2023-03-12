use std::str::FromStr;
use std::ops::{Add, Sub};
use hex::FromHex;
use canistergeek_ic_rust::{
    logger::{log_message},
    monitor::{collect_metrics},
};

pub mod web3;
pub mod types;
pub mod auth;

// todo: change it to state or smth connected to environment
pub const PROXY_CANISTER_ID: &str = "qsgjb-riaaa-aaaaa-aaaga-cai";
pub const MINIMUM_BALANCE: u128 = 100_000_000_000_000_000; // 0.1 ETH

// todo: change it to state or smth connected to environment
pub const KEY_NAME: &str = "dfx_test_key";
// const KEY_NAME: &str = "key_1";
