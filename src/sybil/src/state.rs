// use ic_cdk::api::caller;
use crate::*;

use timer::{fetch_prices_and_send_transactions, run_timer};

#[derive(Clone, Default)]
pub struct State {
    pub exchange_rate_canister: String,
    pub chains: Chains,
    pub pairs: Pairs,
    pub custom_pairs: CustomPairs,
    
    pub asset_data_store: AssetDataStore,
    pub timer_id: TimerId,
}

impl State {
    pub fn new() -> Self {
        State::default()
    }
}

thread_local! {
    pub static STATE: RefCell<State> = RefCell::new(State::new());
}

// fn is_owner() -> Result<(), String> {
//     STATE.with(|s| {
//         let state = s.borrow();
//         if state.owner == ic_cdk::api::caller() {
//             Ok(())
//         } else {
//             Err("unauthorized".to_string())
//         }
//     })
// }
// 
// fn is_authorized() -> Result<(), String> {
//     STATE.with(|s| {
//         let state = s.borrow();
//         let caller = ic_cdk::api::caller();
//         if state.owner == caller || state.controllers.contains(&caller){
//             Ok(())
//         } else {
//             Err("unauthorized".to_string())
//         }
//     })
// }

fn validate_caller() -> () {
    let caller = ic_cdk::api::caller();
    
    // todo: change to controllers later
    let allowed_callers = vec![Principal::anonymous()];
    
    if allowed_callers.contains(&caller) {
        ()
    } else {
        ic_cdk::api::trap("Invalid caller");
    };
}

#[update]
pub async fn run_root_updater(interval: u64) {
    if interval < 60 {
        ic_cdk::api::trap("Interval should be more than 60 seconds");
    }
    
    validate_caller();
    
    let timer_id = run_timer(interval);
    // fetch_prices_and_send_transactions().await;
    
    STATE.with(|state| {
        state.borrow_mut().timer_id = timer_id;
    });
    
    println!("Timer started");
    canistergeek_ic_rust::logger::log_message("Timer started".to_string());
}

#[update]
pub fn stop_timer() {
    validate_caller();
    
    STATE.with(|state| {
        let timer_id = state.borrow().timer_id;
    
        clear_timer(timer_id);
        canistergeek_ic_rust::logger::log_message("Timer stopped".to_string());
    });
}

// everyone can reach this function
#[query]
pub fn get_asset_data_with_proof(symbol: String) -> Option<(AssetData, Vec<String>)> { 
    let asset_data_store = STATE.with(|state| state.borrow().asset_data_store.clone());
    
    // let asset_data = match asset_data_store.get_asset_data(&symbol.clone()) {
    //     Some(asset_data) => asset_data.clone(),
    //     None => {
    //         ic_cdk::trap(&format!("Asset data for symbol {} not found", symbol));
    //     },
    // };
    
    let asset_data = asset_data_store.get_asset_data(&symbol.clone());
        
    let proof = asset_data_store.get_proof(&symbol.clone());
        
    Some((asset_data, proof))
}

#[update]
pub fn set_exchange_rate_canister(new_principal: String) {
    validate_caller();
    
    STATE.with(|state| {
        state.borrow_mut().exchange_rate_canister = new_principal;
    });
}

#[query]
pub fn get_exchange_rate_canister() -> String {
    STATE.with(|state| state.borrow().exchange_rate_canister.clone())
}

#[update]
pub fn add_pair(pair_id: String) {
    validate_caller();
    
    let assets: Vec<&str> = pair_id.split('/').collect();
    if assets.len() != 2 {
        ic_cdk::trap(&format!("Invalid trading pair format: {}", pair_id));
    }
    
    let pair = Pair {
        id: pair_id.clone(),
        base: assets[0].to_string(),
        quote: assets[1].to_string(),
        rate_data: None,
    };
    
    STATE.with(|state| {
        state.borrow_mut().pairs.push(pair);
    });
}

#[update]
pub fn remove_pair(pair_id: String) {
    validate_caller();
    
    STATE.with(|state| {
        let pairs = &mut state.borrow_mut().pairs;
        if let Some(index) = pairs.iter().position(|pair| pair.id == pair_id) {
            pairs.remove(index);
        }
    });
}

#[query]
pub fn get_pairs() -> Pairs {
    STATE.with(|state| state.borrow().pairs.clone())
}

// internal
pub fn set_pairs(_pairs: Pairs) {
    STATE.with(|state| {
        state.borrow_mut().pairs = _pairs;
    });
}

#[update]
pub fn add_custom_pair(custom_pair: CustomPair) {
    validate_caller();
    
    STATE.with(|state| {
        state.borrow_mut().custom_pairs.push(custom_pair);
    });
}

#[update]
pub fn remove_custom_pair(pair_id: String) {
    validate_caller();
    
    STATE.with(|state| {
        let custom_pairs = &mut state.borrow_mut().custom_pairs;
        if let Some(index) = custom_pairs.iter().position(|pair| pair.id == pair_id) {
            custom_pairs.remove(index);
        }
    });
}

#[query]
pub fn get_custom_pairs() -> CustomPairs {
    STATE.with(|state| state.borrow().custom_pairs.clone())
}

#[update]
pub fn add_chain(chain: Chain) {
    validate_caller();
    
    STATE.with(|state| {
        state.borrow_mut().chains.push(chain);
    });
}

#[update]
pub fn remove_chain(chain_id: u64) {
    validate_caller();
    
    STATE.with(|state| {
        let chains = &mut state.borrow_mut().chains;
        if let Some(index) = chains.iter().position(|chain| chain.chain_id == chain_id) {
            chains.remove(index);
        }
    });
}

#[query]
pub fn get_chains() -> Chains {
    STATE.with(|state| state.borrow().chains.clone())
}

// internal
pub fn get_asset_data_store() -> AssetDataStore {
    STATE.with(|state| state.borrow().asset_data_store.clone())
}

// internal
pub fn update_asset_data_store(asset_data_store: AssetDataStore) {
    STATE.with(|state| {
        state.borrow_mut().asset_data_store = asset_data_store;
    });
}


