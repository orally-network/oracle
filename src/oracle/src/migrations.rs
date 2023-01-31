use crate::*;

#[pre_upgrade]
fn pre_upgrade() {
    // save states

    let fetcher = FETCHER.with(|fetcher| fetcher.take());
    let subscriptions = SUBSCRIPTIONS.with(|subscriptions| subscriptions.take());
    let chain_id = CHAIN_ID.with(|chain_id| chain_id.take());
    let rpc = RPC.with(|rpc| rpc.take());
    let factory_address = FACTORY_ADDRESS.with(|factory_address| factory_address.take());

    // monitoring
    let monitor_stable_data = canistergeek_ic_rust::monitor::pre_upgrade_stable_data();
    let logger_stable_data = canistergeek_ic_rust::logger::pre_upgrade_stable_data();

    ic_cdk::println!(
        "!pre_upgrade: fetcher: {:?}, subscriptions: {:?}, chain_id: {:?}, rpc: {:?}, factory_address: {:?}",
        fetcher,
        map_subscriptions_to_show(subscriptions.clone()),
        chain_id,
        rpc,
        factory_address,
    );
    log_message(
        format!(
            "pre_upgrade fetcher: {:?}, subscriptions: {:?}, chain_id: {:?}, rpc: {:?}, factory_address: {:?}",
            fetcher,
            map_subscriptions_to_show(subscriptions.clone()),
            chain_id,
            rpc,
            factory_address
        )
    );

    storage::stable_save((fetcher, subscriptions, chain_id, rpc, factory_address, monitor_stable_data, logger_stable_data)).expect("failed to save to stable storage");
}

#[post_upgrade]
fn post_upgrade() {
    // restore states

    let (fetcher, subscriptions, chain_id, rpc, factory_address, monitor_stable_data, logger_stable_data,):
        (Fetcher, Vec<Subscription>, u64, String, String, canistergeek_ic_rust::monitor::PostUpgradeStableData, canistergeek_ic_rust::logger::PostUpgradeStableData)
        = storage::stable_restore().expect("failed to restore from stable storage");

    ic_cdk::println!(
        "post_upgrade: fetcher: {:?}, subscriptions: {:?}, chain_id: {:?}, rpc: {:?}, factory_address: {:?}",
        fetcher,
        map_subscriptions_to_show(subscriptions.clone()),
        chain_id,
        rpc,
        factory_address,
    );
    log_message(
        format!(
            "post_upgrade fetcher: {:?}, subscriptions: {:?}, chain_id: {:?}, rpc: {:?}, factory_address: {:?}",
            fetcher,
            map_subscriptions_to_show(subscriptions.clone()),
            chain_id,
            rpc,
            factory_address
        )
    );

    // monitoring
    canistergeek_ic_rust::monitor::post_upgrade_stable_data(monitor_stable_data);
    canistergeek_ic_rust::logger::post_upgrade_stable_data(logger_stable_data);

    FETCHER.with(|f| f.replace(fetcher));
    SUBSCRIPTIONS.with(|s| s.replace(subscriptions));
    CHAIN_ID.with(|c| c.replace(chain_id));
    RPC.with(|r| r.replace(rpc));
    FACTORY_ADDRESS.with(|f| f.replace(factory_address));
}
