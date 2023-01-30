use ic_cdk_macros::{query};
use crate::*;

#[query]
fn get_subscriptions() -> Vec<(String, String)> {
    SUBSCRIPTIONS.with(|subscriptions| map_subscriptions_to_show(subscriptions.borrow().clone()))
}

#[query]
fn get_fetcher() -> String {
    FETCHER.with(|fetcher| {
        let f = fetcher.borrow().clone();

        format!("{:?}", f)
    })
}

#[query]
fn get_chain_id() -> u64 {
    CHAIN_ID.with(|chain_id| chain_id.borrow().clone())
}

#[query]
fn get_rpc() -> String {
    RPC.with(|rpc| rpc.borrow().clone())
}

#[query]
fn get_factory_address() -> String {
    FACTORY_ADDRESS.with(|factory_address| factory_address.borrow().clone())
}
