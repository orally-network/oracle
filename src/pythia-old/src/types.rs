use ic_cdk::export::{
    serde::{Deserialize, Serialize},
    candid::CandidType,
};

use std::collections::HashMap;

use crate::*;

use orally_shared::types::{Subscription};

#[derive(Clone, Debug, Default)]
pub struct Chain {
    pub subscriptions: Vec<Subscription>,
    pub rpc: String,
    pub chain_id: u64,
    pub frequency: u64,
    pub timer_id: TimerId,
}

// chain_id -> ChainSubscriptions
#[derive(Clone, Debug, Default, CandidType)]
pub struct Chains(HashMap<String, Chain>);
