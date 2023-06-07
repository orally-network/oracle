use ic_cdk::{storage};
use ic_cdk_macros::{pre_upgrade, post_upgrade};

use crate::*;
use crate::types::Subscriptions;

#[pre_upgrade]
fn pre_upgrade() {
    // save states

    let owner = OWNER.with(|owner| owner.take());
    let subscriptions = SUBSCRIPTIONS.with(|subscriptions| subscriptions.take());

    // monitoring
    let monitor_stable_data = canistergeek_ic_rust::monitor::pre_upgrade_stable_data();
    let logger_stable_data = canistergeek_ic_rust::logger::pre_upgrade_stable_data();

    ic_cdk::println!(
        "!pre_upgrade: owner: {:?}, subscriptions: {:?}",
        owner,
        subscriptions,
    );
    log_message(
        format!(
            "!pre_upgrade: owner: {:?}, subscriptions: {:?}",
            owner,
            subscriptions,
        )
    );

    storage::stable_save((owner, subscriptions, monitor_stable_data, logger_stable_data)).expect("failed to save to stable storage");
}

#[post_upgrade]
fn post_upgrade() {
    // restore states

    let (owner, subscriptions, monitor_stable_data, logger_stable_data,):
        (String, Subscriptions, canistergeek_ic_rust::monitor::PostUpgradeStableData, canistergeek_ic_rust::logger::PostUpgradeStableData)
        = storage::stable_restore().expect("failed to restore from stable storage");

    ic_cdk::println!(
        "post_upgrade: owner: {:?}, subscriptions: {:?}",
        owner,
        subscriptions,
    );
    log_message(
        format!(
            "post_upgrade: owner: {:?}, subscriptions: {:?}",
            owner,
            subscriptions,
        )
    );

    // monitoring
    canistergeek_ic_rust::monitor::post_upgrade_stable_data(monitor_stable_data);
    canistergeek_ic_rust::logger::post_upgrade_stable_data(logger_stable_data);

    OWNER.with(|o| o.replace(owner));
    SUBSCRIPTIONS.with(|s| s.replace(subscriptions));
}
