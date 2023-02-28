use ic_cdk::export::{
    Principal,
};
use ic_web3::{
    contract::{Contract, Options},
    ethabi::ethereum_types::{U64, U256},
    types::{Address, TransactionParameters, BlockId, BlockNumber},
    transports::{ICHttp},
    Web3,
    ic::{get_eth_addr, KeyInfo},
};
use canistergeek_ic_rust::{
    logger::{log_message},
    monitor::{collect_metrics},
};

use crate::types::{Subscription};

const MINIMUM_BALANCE: u128 = 100_000_000_000_000_000; // 0.1 ETH

const KEY_NAME: &str = "dfx_test_key";
// const KEY_NAME: &str = "key_1";

pub async fn check_balance(address: String, rpc: String) -> Result<U256, String> {
    let w3 = match ICHttp::new(&rpc, None, None) {
        Ok(v) => { Web3::new(v) },
        Err(e) => { return Err(e.to_string()) },
    };
    
    let balance = w3.eth().balance(Address::from_str(&address).unwrap(), None).await.map_err(|e| {
        ic_cdk::println!("get balance failed: {}", e);
        log_message(format!("get balance failed: {}", e));
        ic_cdk::trap(&format!("get balance failed: {}", e));
    }).unwrap();
    
    ic_cdk::println!("address: {}, balance: {}", address, balance);
    log_message(format!("address: {}, balance: {}", address, balance));
    
    if balance < U256::from(MINIMUM_BALANCE) {
        let msg = format!("balance is not enough: {}, address: {}", balance, address);
        
        ic_cdk::println!(msg);
        log_message(msg.clone());
     
        Err(msg)
    }
    
    Ok(balance)
}

pub async fn send_signed_transaction(
    rpc: String,
    chain_id: u64,
    proxy_canister_id: Option<String>,
    ecdsa_sign_cycles: Option<u64>,
    subscription: Subscription,
    data: Option<Vec<u8>>,
) -> Result<String, String> {
    let proxy_canister_id = match proxy_canister_id {
        Some(v) => Some(Principal::from_text(v).unwrap()),
        None => None,
    };
    
    // ecdsa key info
    let derivation_path = vec![hex::decode(subscription.owner_address).unwrap().to_vec()];
    let key_info = KeyInfo{
        derivation_path,
        key_name: KEY_NAME.to_string(),
        proxy_canister_id,
        ecdsa_sign_cycles,
    };
    
    let w3 = match ICHttp::new(&rpc, None, None) {
        Ok(v) => { Web3::new(v) },
        Err(e) => { return Err(e.to_string()) },
    };
    
    let contract = Contract::from_json(
        w3.eth(),
        Address::from_str(&subscription.contract_address).unwrap(),
        &*subscription.abi
    ).map_err(|e| {
        log_message(format!("Failed to create contract: {:?}", e));
        format!("init contract failed: {:?}", e);
        
        Err(e)
    })?;
    
    let canister_addr = get_eth_addr(key_info.proxy_canister_id, key_info.clone())
        .await
        .map_err(|e| {
            log_message(format!("get canister eth addr failed: {}", e));
            format!("get canister eth addr failed: {}", e);
            
            Err(e)
        })?;
    
    ic_cdk::println!("canister_addr: {}", canister_addr);
    log_message(format!("canister_addr: {}", canister_addr));
    
    // add nonce to options
    let tx_count_res = w3.eth()
        .transaction_count(canister_addr, None)
        .await
        .map_err(|e| {
            log_message(format!("get transaction count failed: {}", e));
            format!("get tx count error: {}", e);
            
            Err(e)
        })?;
    let tx_count = U256::from(tx_count_res.add(subscription.index));
    
    // get gas_price
    let gas_price = w3.eth()
        .gas_price()
        .await
        .map_err(|e| {
            log_message(format!("get gas price error: {}", e));
            format!("get gas_price error: {}", e);
            
            Err(e)
        })?;
    // legacy transaction type is still ok
    let options = Options::with(|op| {
        op.nonce = Some(tx_count);
        op.gas_price = Some(gas_price);
        // todo: calculate it
        op.gas = Some(U256::from(100000));
        op.transaction_type = Some(U64::from(subscription.tx_type))
    });
    
    ic_cdk::println!("Price from oracle: {}, gas price: {}, tx_count: {}, chain_id: {}", price, gas_price, tx_count, chain_id);
    log_message(format!("Price from oracle: {}, gas price: {}, tx_count: {}, chain_id: {}", price, gas_price, tx_count, chain_id));
    
    let txhash = contract
        .signed_call(&subscription.method, (data,), options, canister_addr.to_string(), key_info, chain_id)
        .await
        .map_err(|e| {
            log_message(format!("token transfer failed: {}, contract: {}", e, subscription.contract_address));
            format!("token transfer failed: {}, contract: {}", e, subscription.contract_address);
            
            Err(e)
        })?;
    
    ic_cdk::println!("txhash: {}, contract: {}", hex::encode(txhash), subscription.contract_address);
    log_message(format!("txhash: {}, contract: {}", hex::encode(txhash), subscription.contract_address));
    
    Ok(hex::encode(txhash))
}
