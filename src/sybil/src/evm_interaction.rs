use ic_web3::{
    contract::{Contract, Options},
    ethabi::ethereum_types::{U64, U256},
    ethabi::{Token, ParamType},
    types::{Address, TransactionParameters, BlockId, BlockNumber, TransactionReceipt},
    transports::{ICHttp},
    Web3,
    ic::{get_eth_addr, KeyInfo},
};
use ic_web3::contract::tokens::Tokenizable;
use rs_merkle::utils::collections::{to_hex_string};

use crate::*;
use crate::state::get_chains;
use crate::asset_data_store::{Hash};

const ECDSA_SIGN_CYCLES: u64 = 30_000_000_000;

// todo: change it to state or smth connected to environment
pub const KEY_NAME: &str = "dfx_test_key";
// const KEY_NAME: &str = "key_1";

pub const ABI: &[u8] = include_bytes!("./evm/abi.json");

fn string_to_bytes32(s: &str) -> [u8; 32] {
    let mut bytes = [0u8; 32];
    let string_bytes = s.as_bytes();
    let len = string_bytes.len().min(32);
    bytes[..len].copy_from_slice(&string_bytes[..len]);
    bytes
}

pub async fn send_signed_transaction(
    chain: Chain,
    root_hash: Hash,
) -> Result<String, String> {
    // ecdsa key info 
    let key_info = KeyInfo{
        derivation_path: vec![ic_cdk::id().as_slice().to_vec()],
        key_name: KEY_NAME.to_string(),
        proxy_canister_id: None,
        ecdsa_sign_cycles: Some(ECDSA_SIGN_CYCLES),
    };
    
    let w3 = match ICHttp::new(&chain.rpc, None, None) {
        Ok(v) => { Web3::new(v) },
        Err(e) => { return Err(e.to_string()) },
    };
    
    let contract = Contract::from_json(
        w3.eth(),
        Address::from_str(&chain.contract_address).unwrap(),
        ABI,
    ).map_err(|e| {
        canistergeek_ic_rust::logger::log_message(format!("Failed to create contract: {:?}", e));
        ic_cdk::println!("Failed to create contract: {:?}", e);
        ic_cdk::trap(&*format!("init contract failed: {:?}", e));
        format!("init contract failed: {:?}", e)
    })?;
    
    // let execution_address = get_eth_addr(key_info.proxy_canister_id, key_info.clone())
    let execution_address = get_eth_addr(Some(ic_cdk::id()), key_info.clone())
        .await
        .map_err(|e| {
            canistergeek_ic_rust::logger::log_message(format!("get execution_address eth addr failed: {}", e));
            ic_cdk::println!("get execution_address eth addr failed: {}", e);
            ic_cdk::trap(&*format!("get execution_address eth addr failed: {}", e));
            format!("get execution_address eth addr failed: {}", e)
        })?;
    
    ic_cdk::println!("execution_address: {}", hex::encode(execution_address));
    canistergeek_ic_rust::logger::log_message(format!("execution_address: {}", execution_address));
    
    // add nonce to options
    let tx_count = w3.eth()
        .transaction_count(execution_address, None)
        .await
        .map_err(|e| {
            canistergeek_ic_rust::logger::log_message(format!("get transaction count failed: {}", e));
            ic_cdk::println!("get transaction count failed: {}", e);
            ic_cdk::trap(&*format!("get tx count error: {}", e));
            format!("get tx count error: {}", e)
        })?;
    
    // get gas_price
    let gas_price = w3.eth()
        .gas_price()
        .await
        .map_err(|e| {
            canistergeek_ic_rust::logger::log_message(format!("get gas price error: {}", e));
            ic_cdk::println!("get gas price error: {}", e);
            ic_cdk::trap(&*format!("get gas_price error: {}", e));
            format!("get gas_price error: {}", e)
        })?;
    
    // let gas = w3.eth()
    //     .estimate_gas()
    //     .await
    //     .map_err(|e| {
    //         canistergeek_ic_rust::logger::log_message(format!("get gas error: {}", e));
    //         ic_cdk::println!("get gas error: {}", e);
    //         format!("get gas error: {}", e)
    //     })?;
    
    // legacy transaction type is still ok
    let options = Options::with(|op| {
        op.nonce = Some(tx_count);
        op.gas_price = Some(gas_price);
        // todo: calculate it
        op.gas = Some(U256::from(100000));
        op.transaction_type = Some(U64::from(0)) // lagacy. use 2 for eip-1559 (some l2 doesn't support it)
    });
    
    ic_cdk::println!("Sybil-light: gas price: {}, tx_count: {}, chain_id: {}, root_hash: {}, root_hash2: {}", gas_price, tx_count, chain.chain_id, hex::encode(root_hash), to_hex_string(&root_hash));
    canistergeek_ic_rust::logger::log_message(format!("Sybil-light: gas price: {}, tx_count: {}, chain_id: {}", gas_price, tx_count, chain.chain_id));
    
    // let receipt: TransactionReceipt = contract
    //     .signed_call_with_confirmations("setRoot", (root_hash.to_string(),), options, execution_address.to_string(), 3, key_info, chain.chain_id)
    //     .await
    //     .map_err(|e| {
    //         canistergeek_ic_rust::logger::log_message(format!("sign and send tx failed: {}, contract: {}", e, chain.contract_address));
    //         ic_cdk::println!("sign and send tx failed: {}, contract: {}", e, chain.contract_address);
    //         ic_cdk::trap(&*format!("sign and send tx failed failed: {}, contract: {}", e, chain.contract_address));
    //         format!("sign and send tx failed failed: {}, contract: {}", e, chain.contract_address)
    //     })?;
    // 
    // ic_cdk::println!("txhash: {}, contract: {}, receipt: {:?}", hex::encode(receipt.transaction_hash), chain.contract_address, receipt);
    // canistergeek_ic_rust::logger::log_message(format!("txhash: {}, contract: {}, receipt: {:?}", hex::encode(receipt.transaction_hash), chain.contract_address, receipt));
    // 
    // Ok(hex::encode(receipt.transaction_hash))
    
    let txhash = contract
        .signed_call("setRoot", (root_hash,), options, hex::encode(execution_address), key_info, chain.chain_id)
        .await
        .map_err(|e| {
            canistergeek_ic_rust::logger::log_message(format!("sign and send tx failed: {}, contract: {}", e, chain.contract_address));
            ic_cdk::println!("sign and send tx failed: {}, contract: {}", e, chain.contract_address);
            ic_cdk::trap(&*format!("sign and send tx failed failed: {}, contract: {}", e, chain.contract_address));
            format!("sign and send tx failed failed: {}, contract: {}", e, chain.contract_address)
        })?;
    
    ic_cdk::println!("txhash: {}, contract: {}", hex::encode(txhash), chain.contract_address);
    
    Ok(hex::encode(txhash))
}

pub async fn send_transactions(chains: Chains, root_hash: Hash) -> Result<Vec<String>, String> {
    let mut futures = Vec::new();
    for chain in chains {
        futures.push(
            send_signed_transaction(chain, root_hash.clone())
        );
    }
    
    let results = futures::future::join_all(futures).await;
    
    let result_hashes = results
        .into_iter()
        .map(|result| {
            match result {
                Ok(hash) => hash,
                Err(e) => {
                    canistergeek_ic_rust::logger::log_message(format!("send_signed_transaction failed: {}", e));
                    ic_cdk::println!("send_signed_transaction failed: {}", e);
                    return e;
                }
            }
        })
        .collect::<Vec<String>>();
    
    Ok(result_hashes)
}

#[update]
pub async fn test_sending_transaction(root_hash: Hash) -> Result<Vec<String>, String> {
    let chains = get_chains();
    
    match send_transactions(chains, root_hash).await {
        Ok(res) => {
            Ok(res)
        },
        Err(e) => {
            Err(e)
        }
    }
}
