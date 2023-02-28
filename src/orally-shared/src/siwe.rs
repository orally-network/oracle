use time::{OffsetDateTime};
use siwe::{Message, VerificationOpts};
use ic_web3::ic::{get_eth_addr, KeyInfo};
use ic_cdk::export::{Principal};

use crate::*;

pub async fn verify_address(siwe_msg: String, siwe_sig: String) -> Result<String, String> {
    let opts = VerificationOpts {
        domain: None,
        nonce: None,
        timestamp: Some(OffsetDateTime::from_unix_timestamp((ic_cdk::api::time() / (1000 * 1000 * 1000)) as i64).unwrap())
    };
    
    let msg = Message::from_str(&siwe_msg).map_err(|e| e.to_string())?;
    let sig = <[u8; 65]>::from_hex(siwe_sig).map_err(|e| e.to_string())?;
    
    let log_msg = format!("validate_address: msg: {:?}, sig: {:?}", msg, sig);
    ic_cdk::println!(log_msg);
    log_message(log_msg);
    
    msg.verify(&sig, &opts).await.map_err(|e| e.to_string())?;
    
    Ok(hex::encode(msg.address))
}

pub async fn generate_execution_address(owner_address: String) -> Result<String, String> {
    let derivation_path = vec![hex::decode(owner_address).unwrap().to_vec()];
    
    let key_info = KeyInfo{
        derivation_path,
        key_name: KEY_NAME.to_string(),
        proxy_canister_id: Some(Principal::from_text(PROXY_CANISTER_ID).unwrap()),
        ecdsa_sign_cycles: None
    };
    
    let execution_address = get_eth_addr(key_info.proxy_canister_id, key_info)
        .await
        .map_err(|e| format!("generate execution address failed: {}", e))?;
    
    Ok(hex::encode(execution_address))
}
