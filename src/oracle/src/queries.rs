use ic_cdk_macros::{query};
use crate::*;

#[derive(Debug, CandidType, Serialize, Deserialize)]
struct State {
    pub subscriptions: Vec<(String, String)>,
    pub fetcher: Fetcher,
    pub chain_id: u64,
    pub rpc: String,
    pub factory_address: String,
}

#[query]
fn get_state() -> State {
    State {
        subscriptions: SUBSCRIPTIONS.with(|subscriptions| map_subscriptions_to_show(subscriptions.borrow().clone())),
        fetcher: FETCHER.with(|fetcher| fetcher.borrow().clone()),
        chain_id: CHAIN_ID.with(|chain_id| chain_id.borrow().clone()),
        rpc: RPC.with(|rpc| rpc.borrow().clone()),
        factory_address: FACTORY_ADDRESS.with(|factory_address| factory_address.borrow().clone()),
    }
}
