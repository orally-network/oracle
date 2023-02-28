use ic_cdk::api::management_canister::main::raw_rand;
use orally_shared::{
    types::{Subscription},
    web3::{check_balance, send_signed_transaction},
};

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
                            notify(subscription.clone(), chain.clone())
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

pub async fn notify(subscription: Subscription, chain: Chain) -> Result<String, String> {
    let subscription = subscription.clone();
    
    let msg = format!("Notify: {:?}", remove_abi_from_subscription(subscription));
    log_message(msg);
    ic_cdk::println!(msg);
    
    // notify
    
    // check execution balance, if not enough, deactivate subscription
    orally_shared::web3::check_balance(
        subscription.address.clone(), 
        subscription.rpc.clone()
    ).await.map_err(|e| {
        log_message(e);
        ic_cdk::println!(e);
        
        // error in case insufficient fund - deactivate subscription
        CHAINS.with(|chains| {
            let mut chains = chains.borrow_mut();
            
            match chains.get_mut(&chain.chain_id) {
                Some(chain) => {
                    for s in chain.subscriptions.iter_mut() {
                        if s.id == subscription.id {
                            s.active = false;
                        }
                    }
                    
                    let msg = format!("Subscription deactivated: {:?}", remove_abi_from_subscription(subscription));
                    log_message(msg);
                    ic_cdk::println!(msg);
                    
                    // todo: check if this trap finishes only one subscription execution
                    ic_cdk::trap("Insufficient fund");
                },
                None => {
                    let msg = format!("Chain not found: {:?}", subscription.chain_id);
                    
                    log_message(msg);
                    ic_cdk::println!(msg);
                    ic_cdk::trap("Chain not found")
                }
            }
        });
    }).unwrap();
    
    let data = match subscription.is_random {
        true => {
            let random = raw_rand().await.map_err(|e| {
                log_message(e.1.clone());
                ic_cdk::println!(e.1);
                
                Err(e.1)
            }).unwrap().0;
            
            Some(random)
        },
        false => None
    };
    
    // send transaction
    let tx_hash = send_signed_transaction(
        chain.rpc.clone(),
        chain.chain_id.clone(),
        Some(orally_shared::PROXY_CANISTER_ID.to_string()),
        None,
        subscription.clone(),
        data,
    ).await.map_err(|e| {
        log_message(e.clone());
        ic_cdk::println!(e);
        
        Err(e)
    }).unwrap();
    
    Ok(tx_hash)
}
