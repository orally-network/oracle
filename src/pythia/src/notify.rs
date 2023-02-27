use crate::*;

use crate::utils::{remove_abi_from_subscription};

pub async fn notify_subscribers(chain_id: u64) {
    CHAINS.with(|chains| {
        let chains = chains.borrow();
        
        match chains.get(&chain_id) {
            Some(chain) => {
                let msg = format!("Notify subscribers: {:?}", chain_id);
                log_message(msg);
                ic_cdk::println!(msg);
                
                for subscription in chain.subscriptions.iter() {
                    if subscription.active {
                        ic_cdk::spawn(
                            notify(subscription.clone())
                        );
                    } else {
                        let msg = format!("Subscription is not active: {:?}", remove_abi_from_subscription(subscription.clone()));
                        log_message(msg);
                        ic_cdk::println!(msg);
                    }
                }
            },
            None => {
                let msg = format!("Chain not found: {:?}", chain_id);
                
                log_message(msg);
                ic_cdk::println!(msg);
                ic_cdk::trap("Chain not found")
            }
        }
    });
}

pub async fn notify(subscription: Subscription) {
    let subscription = subscription.clone();
    
    let msg = format!("Notify: {:?}", remove_abi_from_subscription(subscription));
    log_message(msg);
    ic_cdk::println!(msg);
    
    // notify
}
