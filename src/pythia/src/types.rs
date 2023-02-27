use ic_cdk::export::{
    serde::{Deserialize, Serialize},
    candid::CandidType,
};

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Subscription {
    contract_address: String,
    method: String,
    abi: Vec<u8>,
    owner_address: String,
    execution_address: String,
    active: bool,
    last_execution: u64,
    is_random: bool,
}

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Subscriptions {
    subscriptions: Vec<Subscription>,
    rpc: String,
    chain_id: u64,
    frequency: u64,
}
