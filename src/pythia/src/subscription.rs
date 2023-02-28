use orally_shared::{
    siwe::{verify_address, generate_execution_address},
    web3::{check_balance},
    types::{Subscription},
};

use crate::*;

#[update]
pub async fn subscribe(chain_id: u64, contract_address: String, method: String, abi: Vec<u8>, message: String, signature: String, is_random: boolean, tx_type: u64) -> Result<String, String> {
    let msg = format!("Subscribe: chain_id: {:?}, contract_address: {:?}, method: {:?}, abi: {:?}, message: {:?}, signature: {:?}", chain_id, contract_address, method, abi, message, signature);
    log_message(msg);
    ic_cdk::println!(msg);
    
    // verify signature
    let owner_address = verify_address(message.clone(), signature.clone()).map_err(|e| {
        let msg = format!("Verify address failed: {:?}", e);
        log_message(msg.clone());
        ic_cdk::println!(msg);
        
        msg
    })?;
    
    // generate execution address
    let execution_address = generate_execution_address(owner_address.clone()).map_err(|e| {
        let msg = format!("Generate execution address failed: {:?}", e);
        log_message(msg.clone());
        ic_cdk::println!(msg);
        
        msg
    })?;
    
    let rpc = CHAINS.with(|chains| {
        let chains = chains.borrow();
        let chain = chains.get(&chain_id).unwrap();
        
        chain.rpc.clone()
    });
    
    check_balance(execution_address.clone(), rpc).await.map_err(|e| {
        log_message(e.clone());
        ic_cdk::println!(e);
        
        e
    })?;
    
    // index of how much subscriptions with this execution wallet address
    let index = CHAINS.with(|chains| {
        let mut chains = chains.borrow();
        let chain = chains.get(&chain_id).unwrap();
        
        let mut index = 0;
        
        for subscription in chain.subscriptions.iter() {
            if subscription.execution_address == execution_address {
                index += 1;
            }
        }
        
        index
    });
    
    // add subscription to state
    let subscription = Subscription{
        owner_address,
        execution_address,
        contract_address,
        method,
        abi: Some(abi),
        active: true,
        is_random,
        tx_type,
        last_execution: 0,
        index,
    };
    
    CHAINS.with(|chains| {
        let mut chains = chains.borrow();
        let chain = chains.get_mut(&chain_id).unwrap();
        
        chain.subscriptions.push(subscription);
    });
    
    Ok("Subscription added".to_string())
}

// after user topped up execution wallet. 1 execution address = 1 owner = many subscriptions
#[update]
pub async fn renew_subscription(chain_id: u64, execution_address: String) -> Result<String, String> {
    check_balance(execution_address.clone(), rpc).await.map_err(|e| {
        log_message(e.clone());
        ic_cdk::println!(e);
        
        e
    })?;
    
    CHAINS.with(|chains| {
        let mut chains = chains.borrow();
        let chain = chains.get_mut(&chain_id).unwrap();
        
        for subscription in chain.subscriptions.iter_mut() {
            if subscription.execution_address == execution_address {
                subscription.active = true;
                
                let msg = format!("Subscription renewed: {:?}", subscription);
                log_message(msg.clone());
                ic_cdk::println!(msg);
            }
        }
    });
    
    Ok("Subscriptions renewed".to_string())
}
