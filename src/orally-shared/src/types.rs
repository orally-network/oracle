use ic_cdk::export::{
    serde::{Deserialize, Serialize},
    candid::CandidType,
};

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
    pub tx_type: u64,
    // index of subscriptions per user
    pub index: u64,
}
