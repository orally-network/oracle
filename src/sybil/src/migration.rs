use ic_cdk::storage;
use crate::*;

#[pre_upgrade]
fn pre_upgrade() {
    let state = STATE.with(|state| state.borrow().clone());
    
    let exchange_rate_canister = state.exchange_rate_canister;
    let chains = state.chains;
    let pairs = state.pairs;
    let custom_pairs = state.custom_pairs;
    
    ic_cdk::println!(
        "pre_upgrade: exchange_rate_canister: {:?}, chains: {:?}, pairs: {:?}, custom_pairs: {:?}",
        exchange_rate_canister,
        chains,
        pairs,
        custom_pairs,
    );
    canistergeek_ic_rust::logger::log_message(format!(
        "pre_upgrade: exchange_rate_canister: {:?}, chains: {:?}, pairs: {:?}, custom_pairs: {:?}",
        exchange_rate_canister,
        chains,
        pairs,
        custom_pairs,
    ));
    
    // monitoring
    let monitor_stable_data = canistergeek_ic_rust::monitor::pre_upgrade_stable_data();
    let logger_stable_data = canistergeek_ic_rust::logger::pre_upgrade_stable_data();
    
    storage::stable_save((
        exchange_rate_canister,
        chains,
        pairs,
        custom_pairs,
        monitor_stable_data,
        logger_stable_data,
    ))
        .expect("failed to save to stable storage");
}

#[post_upgrade]
fn post_upgrade() {
    // Restore states
    let (
        exchange_rate_canister,
        chains,
        pairs,
        custom_pairs,
        monitor_stable_data,
        logger_stable_data,
    ): (
        String,
        Chains,
        Pairs,
        CustomPairs,
        canistergeek_ic_rust::monitor::PostUpgradeStableData,
        canistergeek_ic_rust::logger::PostUpgradeStableData,
    ) = storage::stable_restore().expect("failed to restore from stable storage");
    
    ic_cdk::println!(
        "post_upgrade: exchange_rate_canister: {:?}, chains: {:?}, pairs: {:?}, custom_pairs: {:?}",
        exchange_rate_canister,
        chains,
        pairs,
        custom_pairs,
    );
    canistergeek_ic_rust::logger::log_message(format!(
        "post_upgrade: exchange_rate_canister: {:?}, chains: {:?}, pairs: {:?}, custom_pairs: {:?}",
        exchange_rate_canister,
        chains,
        pairs,
        custom_pairs,
    ));
    
    // monitoring
    canistergeek_ic_rust::monitor::post_upgrade_stable_data(monitor_stable_data);
    canistergeek_ic_rust::logger::post_upgrade_stable_data(logger_stable_data);
    
    STATE.with(|state| {
        let mut state_mut = state.borrow_mut();
        state_mut.exchange_rate_canister = exchange_rate_canister;
        state_mut.chains = chains;
        state_mut.pairs = pairs;
        state_mut.custom_pairs = custom_pairs;
    });
}
