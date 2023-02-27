use crate::*;

use crate::notify::{notify_subscribers};
use crate::utils::{validate_owner_caller};

#[update(name = "add_chain")]
pub fn add_chain(rpc: String, chain_id: u64, frequency: u64) -> () {
    validate_owner_caller();
    
    let msg = format!("Add chain: {:?}, rpc: {:?}, frequency: {:?}", chain_id, rpc, frequency);
    log_message(msg);
    ic_cdk::println!(msg);
    
    // run timer
    let timer_id = set_timer_interval(
        Duration::from_secs(frequency),
        move || ic_cdk::spawn(
            notify_subscribers(chain_id)
        )
    );
    
    CHAINS.with(|chains| {
        let mut chains = chains.borrow_mut();
        
        if chains.contains_key(&chain_id) {
            ic_cdk::trap("Chain already exists");
        }
        
        let chain = Chain{
            subscriptions: Vec::new(),
            rpc,
            frequency,
            chain_id,
            timer_id,
        };
        
        chains.insert(chain_id, chain);
    });
}

#[update(name = "pause_chain")]
pub fn pause_chain(chain_id: u64) -> () {
    validate_owner_caller();
    
    let msg = format!("Pause chain: {:?}", chain_id);
    log_message(msg);
    ic_cdk::println!(msg);
    
    CHAINS.with(|chains| {
        let mut chains = chains.borrow_mut();
        
        match chains.get_mut(&chain_id) {
            Some(chain) => {
                clear_timer(chain.timer_id);
                chain.timer_id = TimerId::default();
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

#[update(name = "resume_chain")]
pub fn resume_chain(chain_id: u64) -> () {
    validate_owner_caller();
    
    let msg = format!("Resume chain: {:?}", chain_id);
    log_message(msg);
    ic_cdk::println!(msg);
    
    CHAINS.with(|chains| {
        let mut chains = chains.borrow_mut();
        
        match chains.get_mut(&chain_id) {
            Some(chain) => {
                chain.timer_id = set_timer_interval(
                    Duration::from_secs(chain.frequency),
                    move || ic_cdk::spawn(
                        notify_subscribers(chain_id)
                    )
                );
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

#[update(name = "update_chain_frequency")]
pub fn update_chain_frequency(chain_id: u64, frequency: u64) -> () {
    validate_owner_caller();
    
    let msg = format!("Update chain frequency: {:?}, frequency: {:?}", chain_id, frequency);
    log_message(msg);
    ic_cdk::println!(msg);
    
    CHAINS.with(|chains| {
        let mut chains = chains.borrow_mut();
        
        match chains.get_mut(&chain_id) {
            Some(chain) => {
                chain.frequency = frequency;
                
                if chain.timer_id != TimerId::default() {
                    clear_timer(chain.timer_id);
                    chain.timer_id = set_timer_interval(
                        Duration::from_secs(chain.frequency),
                        move || ic_cdk::spawn(
                            notify_subscribers(chain_id)
                        )
                    );
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

#[update(name = "update_chain_rpc")]
pub fn update_chain_rpc(chain_id: u64, rpc: String) -> () {
    validate_owner_caller();
    
    let msg = format!("Update chain rpc: {:?}, rpc: {:?}", chain_id, rpc);
    log_message(msg);
    ic_cdk::println!(msg);
    
    CHAINS.with(|chains| {
        let mut chains = chains.borrow_mut();
        
        match chains.get_mut(&chain_id) {
            Some(chain) => {
                chain.rpc = rpc;
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
