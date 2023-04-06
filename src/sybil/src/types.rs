use crate::*;

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct RateData {
    pub price: u64,
    pub timestamp: u64,
    pub decimals: u32,
    pub base_asset_num_received_rates: u64,
    pub base_asset_num_queried_sources: u64,
}

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct CustomPair {
    pub id: String,
    pub base: String,
    pub quote: String,
    
    pub rate_data: Option<RateData>,
    
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
    
    pub rate_data: Option<RateData>,
}

pub type Pairs = Vec<Pair>;

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Chain {
    pub rpc: String,
    pub chain_id: u64,
    pub contract_address: String,
}

pub type Chains = Vec<Chain>;
