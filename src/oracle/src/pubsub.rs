use std::ffi::OsString;
use std::ops::{Add, Sub};
use ic_cdk::export::{
    candid::CandidType,
    serde::{Deserialize, Serialize},
    Principal,
};
use canistergeek_ic_rust::{
    logger::{log_message},
    monitor::{collect_metrics},
};
use futures::future::join_all;

use crate::*;

// todo: use shared Subscription struct
// todo: multi params in the future
#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Subscription {
    pub contract_address: String,
    pub method: String,
    pub abi: Vec<u8>,

    pub owner_address: String, // H160
    pub execution_address: String,
    // if execution_address is not topped up enough, then the subscription will be paused
    pub active: bool,
    pub last_execution: u64,
    
    // index of subscriptions per user
    pub index: u64,
}

const MINIMUM_BALANCE: u128 = 10_000_000_000_000_000; // 0.01 ETH

pub async fn notify(price: f64) {
    // active subscriptions
    let subscriptions = SUBSCRIPTIONS.with(|subscriptions| {
        subscriptions.borrow().iter().filter(|s| s.active).cloned().collect::<Vec<Subscription>>()
    });

    ic_cdk::println!("notify subscribers");
    log_message(format!("notify subscribers"));
    
    let futures = subscriptions.iter().map(|subscription| {
        ic_cdk::println!("notify subscriber: {}", subscription.contract_address);
        log_message(format!("notify subscriber: {}", subscription.contract_address));
    
        if !subscription.active {
            ic_cdk::api::print(&format!("subscription is not active"));
            ic_cdk::trap(&format!("subscription is not active"));
        }
        
        update_price(
            subscription.clone(),
            price,
        )
    }).collect::<Vec<_>>();
    
    // join all futures and hanlde errors for tuples
    join_all(futures).await.into_iter().for_each(|res| {
        match res {
            Ok(_) => {},
            Err(e) => {
                ic_cdk::println!("update price failed: {}", e);
                log_message(format!("update price failed: {}", e));
            }
        }
    });
}

pub async fn update_price(sub: Subscription, price: f64) -> Result<String, String> {
    check_balance(sub.execution_address).await.map_err(|e| {
        // todo: change that, if fail - it doesn't mean inactive. insufficient balance means inactive.
        ic_cdk::println!("check balance failed: {}", e);
        log_message(format!("check balance failed: {}", e));

        // update subscription to inactive
        SUBSCRIPTIONS.with(|subscriptions| {
            let mut subscriptions = subscriptions.borrow_mut();
            let index = subscriptions.iter().position(|s| s.contract_address == sub.contract_address).unwrap();
            subscriptions[index].active = false;
        });

        format!("check balance failed: {}", e)
    })?;

    // todo: reuse it from orally-shared
    // ecdsa key info
    let derivation_path = vec![hex::decode(sub.owner_address).unwrap().to_vec()];
    let key_info = KeyInfo{ 
        derivation_path, 
        key_name: KEY_NAME.to_string(), 
        proxy_canister_id: Some(Principal::from_text("qsgjb-riaaa-aaaaa-aaaga-cai".to_string()).unwrap()),
        ecdsa_sign_cycles: None
    };

    let rpc_url = RPC.with(|rpc| rpc.borrow().clone());
    // let factory_addr = FACTORY_ADDRESS.with(|f| Principal::from_text(f.borrow().clone()).unwrap());

    let w3 = match ICHttp::new(&rpc_url, None, None) {
        Ok(v) => { Web3::new(v) },
        Err(e) => { return Err(e.to_string()) },
    };

    let contract = Contract::from_json(
        w3.eth(),
        Address::from_str(&sub.contract_address).unwrap(),
        &*sub.abi
    ).map_err(|e| {
        log_message(format!("Failed to create contract: {:?}", e));
        format!("init contract failed: {:?}", e)
    })?;

    let canister_addr = get_eth_addr(key_info.proxy_canister_id, key_info.clone())
        .await
        .map_err(|e| {
            log_message(format!("get canister eth addr failed: {}", e));
            format!("get canister eth addr failed: {}", e)
        })?;

    ic_cdk::println!("canister_addr: {}", canister_addr);
    log_message(format!("canister_addr: {}", canister_addr));

    // add nonce to options
    let tx_count_res = w3.eth()
        .transaction_count(canister_addr, None)
        .await
        .map_err(|e| {
            log_message(format!("get transaction count failed: {}", e));
            format!("get tx count error: {}", e)
        })?;
    let tx_count = ic_web3::ethabi::ethereum_types::U256::from(tx_count_res.add(sub.index));
    
    // get gas_price
    let gas_price = w3.eth()
        .gas_price()
        .await
        .map_err(|e| {
            log_message(format!("get gas price error: {}", e));
            format!("get gas_price error: {}", e)
        })?;
    // legacy transaction type is still ok
    let options = Options::with(|op| {
        op.nonce = Some(tx_count);
        op.gas_price = Some(gas_price);
        op.gas = Some(ic_web3::ethabi::ethereum_types::U256::from(50000));
        
        // todo: make transaction typeg selectable
        op.transaction_type = Some(ic_web3::ethabi::ethereum_types::U64::from(0)) //Legacy_TX_IDs
        // op.transaction_type = Some(ic_web3::ethabi::ethereum_types::U64::from(2)) //EIP1559_TX_ID
    });
    
    let chain_id = CHAIN_ID.with(|chain_id| chain_id.borrow().clone());
    
    ic_cdk::println!("Price from oracle: {}, gas price: {}, tx_count: {}, chain_id: {}", price, gas_price, tx_count, chain_id);
    log_message(format!("Price from oracle: {}, gas price: {}, tx_count: {}, chain_id: {}", price, gas_price, tx_count, chain_id));
    
    let txhash = contract
        .signed_call(&sub.method, (price.to_string(),), options, canister_addr.to_string(), key_info, chain_id)
        .await
        .map_err(|e| {
            log_message(format!("token transfer failed: {}, contract: {}", e, sub.contract_address));
            format!("token transfer failed: {}, contract: {}", e, sub.contract_address)
        })?;

    ic_cdk::println!("txhash: {}, contract: {}", hex::encode(txhash), sub.contract_address);
    log_message(format!("txhash: {}, contract: {}", hex::encode(txhash), sub.contract_address));

    // update last_execution
    SUBSCRIPTIONS.with(|subscriptions| {
        let mut subscriptions = subscriptions.borrow_mut();
        let mut subscription = subscriptions.iter_mut().find(|s| s.contract_address == sub.contract_address).unwrap();
        subscription.last_execution = ic_cdk::api::time();
    });

    Ok(format!("{}", hex::encode(txhash)))
}

#[update]
async fn verify_address(siwe_msg: String, siwe_sig: String) -> Result<(String,String),String> {
    let opts = VerificationOpts {
        domain: None,
        nonce: None,
        timestamp: Some(OffsetDateTime::from_unix_timestamp((ic_cdk::api::time() / (1000 * 1000 * 1000)) as i64).unwrap())
    };

    let msg = Message::from_str(&siwe_msg).map_err(|e| e.to_string())?;
    let sig = <[u8; 65]>::from_hex(siwe_sig).map_err(|e| e.to_string())?;

    ic_cdk::println!("validate_address: msg: {:?}, sig: {:?}", msg, sig);

    msg.verify(&sig, &opts).await.map_err(|e| e.to_string())?;
    
    let derivation_path = vec![msg.address.to_vec()];
    
    let key_info = KeyInfo{ 
        derivation_path, 
        key_name: KEY_NAME.to_string(), 
        proxy_canister_id: Some(Principal::from_text("qsgjb-riaaa-aaaaa-aaaga-cai".to_string()).unwrap()),
        ecdsa_sign_cycles: None
    };

    let canister_addr = get_eth_addr(key_info.proxy_canister_id, key_info)
        .await
        .map_err(|e| format!("get canister eth addr failed: {}", e))?;

    Ok((hex::encode(msg.address), hex::encode(canister_addr)))
}

// todo: reuse from orally-shared::web3::check_balance
async fn check_balance(execution_address: String) -> Result<U256, String> {
    let rpc_url = RPC.with(|rpc| rpc.borrow().clone());

    let w3 = match ICHttp::new(&rpc_url, None, None) {
        Ok(v) => { Web3::new(v) },
        Err(e) => { return Err(e.to_string()) },
    };
    let balance = w3.eth().balance(Address::from_str(&execution_address).unwrap(), None).await.map_err(|e| {
        ic_cdk::println!("get balance failed: {}", e);
        log_message(format!("get balance failed: {}", e));

        e
    }).unwrap();

    ic_cdk::println!("balance: {}", balance);
    log_message(format!("balance: {}", balance));

    if balance < U256::from(MINIMUM_BALANCE) {
        ic_cdk::println!("balance is not enough: {}", balance);
        log_message(format!("balance is not enough: {}", balance));

        ic_cdk::trap(&format!("balance is not enough: {}", balance));
    }

    Ok(balance)
}

// #[update]
// check_top_up_fn

#[update]
async fn subscribe(contract_address: String, method: String, abi: Vec<u8>, message: String, signature: String) -> Result<String, String> {
    // verification
    let (owner_address, execution_address) = verify_address(message, signature).await.map_err(|e| {
        ic_cdk::println!("verify address failed: {}", e);
        log_message(format!("verify address failed: {}", e));

        e
    })?;

    check_balance(execution_address.clone()).await.map_err(|e| {
        ic_cdk::println!("check balance failed: {}", e);
        log_message(format!("check balance failed: {}", e));

        e
    })?;
    
    // index of how much subscriptions with this execution wallet address
    let index = SUBSCRIPTIONS.with(|subscriptions| {
        let subscriptions = subscriptions.borrow();
        subscriptions.iter().filter(|s| s.execution_address == execution_address).count()
    });

    let subscription = Subscription {
        contract_address,
        abi,
        method,
        owner_address,
        execution_address: execution_address.clone(),
        active: true,
        last_execution: 0,
        index: index as u64,
    };

    SUBSCRIPTIONS.with(|subscriptions| {
        subscriptions.borrow_mut().push(subscription);

        ic_cdk::println!("subscriptions: {:?}", map_subscriptions_to_show(subscriptions.borrow().clone()));
        log_message(format!("subscriptions: {:?}", map_subscriptions_to_show(subscriptions.borrow().clone())));
    });

    Ok("success".to_string())
}
