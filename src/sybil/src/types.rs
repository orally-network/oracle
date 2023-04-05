use crate::*;

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct CustomPair {
    pub id: String,
    pub base: String,
    pub quote: String,
    
    pub price: u64,
    pub timestamp: u64,
    
    pub sources: Vec<String>,
    // subscription for listing this pair
    // pub subscription: Subscription,
}

pub type CustomPairs = Vec<CustomPair>;

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Pair {
    pub id: String,
    pub base: String,
    pub quote: String,
    
    pub price: u64,
    pub timestamp: u64,
}

pub type Pairs = Vec<Pair>;

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Chain {
    pub rpc: String,
    pub chain_id: u64,
    pub contract_address: String,
}

pub type Chains = Vec<Chain>;
