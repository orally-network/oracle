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

use crate::*;
use crate::types::{Subscription};

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
        
        ic_cdk::api::print(msg.clone());
        log_message(msg.clone());
     
        // Err(msg)
        ic_cdk::trap(&msg);
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
        &*subscription.abi.unwrap()
    ).map_err(|e| {
        log_message(format!("Failed to create contract: {:?}", e));
        ic_cdk::println!("Failed to create contract: {:?}", e);
        format!("init contract failed: {:?}", e)
    })?;
    
    let execution_address = get_eth_addr(key_info.proxy_canister_id, key_info.clone())
        .await
        .map_err(|e| {
            log_message(format!("get execution_address eth addr failed: {}", e));
            ic_cdk::println!("get execution_address eth addr failed: {}", e);
            format!("get execution_address eth addr failed: {}", e)
        })?;
    
    ic_cdk::println!("execution_address: {}", execution_address);
    log_message(format!("execution_address: {}", execution_address));
    
    // add nonce to options
    let tx_count_res = w3.eth()
        .transaction_count(execution_address, None)
        .await
        .map_err(|e| {
            log_message(format!("get transaction count failed: {}", e));
            ic_cdk::println!("get transaction count failed: {}", e);
            format!("get tx count error: {}", e)
        })?;
    let tx_count = U256::from(tx_count_res.add(subscription.index));
    
    // get gas_price
    let gas_price = w3.eth()
        .gas_price()
        .await
        .map_err(|e| {
            log_message(format!("get gas price error: {}", e));
            ic_cdk::println!("get gas price error: {}", e);
            format!("get gas_price error: {}", e)
        })?;
    // legacy transaction type is still ok
    let options = Options::with(|op| {
        op.nonce = Some(tx_count);
        op.gas_price = Some(gas_price);
        // todo: calculate it
        op.gas = Some(U256::from(100000));
        op.transaction_type = Some(U64::from(subscription.tx_type))
    });
    
    ic_cdk::println!("Pythia: gas price: {}, tx_count: {}, chain_id: {}", gas_price, tx_count, chain_id);
    log_message(format!("Pythia: gas price: {}, tx_count: {}, chain_id: {}", gas_price, tx_count, chain_id));
    
    let txhash = contract
        .signed_call(&subscription.method, (data,), options, execution_address.to_string(), key_info, chain_id)
        .await
        .map_err(|e| {
            log_message(format!("sign and send tx failed: {}, contract: {}", e, subscription.contract_address));
            ic_cdk::println!("sign and send tx failed: {}, contract: {}", e, subscription.contract_address);
            format!("sign and send tx failed failed: {}, contract: {}", e, subscription.contract_address)
        })?;
    
    ic_cdk::println!("txhash: {}, contract: {}", hex::encode(txhash), subscription.contract_address);
    log_message(format!("txhash: {}, contract: {}", hex::encode(txhash), subscription.contract_address));
    
    Ok(hex::encode(txhash))
}
