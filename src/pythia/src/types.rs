use ic_cdk::export::{
    serde::{Deserialize, Serialize},
    candid::CandidType,
};

use std::collections::HashMap;

use crate::*;

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Subscription {
    pub contract_address: String,
    pub method: String,
    pub abi: Option<Vec<u8>>,
    pub owner_address: String,
    pub execution_address: String,
    pub active: bool,
    pub last_execution: u64,
    pub is_random: bool,
}

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Chain {
    pub subscriptions: Vec<Subscription>,
    pub rpc: String,
    pub chain_id: u64,
    pub frequency: u64,
    pub timer_id: TimerId,
}

// chain_id -> ChainSubscriptions
#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Chains(HashMap<String, Chain>);
