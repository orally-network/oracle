// use ic_cdk::api::caller;
use crate::*;

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct State {
    pub exchange_rate_canister: String,
    pub chains: Chains,
    pub pairs: Pairs,
    pub custom_pairs: CustomPairs,
}

impl State {
    pub fn new() -> Self {
        State::default()
    }
}

thread_local! {
    pub static STATE: RefCell<State> = RefCell::new(State::new());
}

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
pub fn set_exchange_rate_canister_principal(new_principal: String) {
    validate_caller();
    
    STATE.with(|state| {
        state.borrow_mut().exchange_rate_canister = new_principal;
    });
}

#[query]
pub fn get_exchange_rate_canister_principal() -> String {
    STATE.with(|state| state.borrow().exchange_rate_canister.clone())
}

#[update]
pub fn add_pair(pair: Pair) {
    validate_caller();
    
    // let assets: Vec<&str> = pair.split('/').collect();
    // if assets.len() != 2 {
    //     return Err(format!("Invalid trading pair format: {}", pair));
    // }
    
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
