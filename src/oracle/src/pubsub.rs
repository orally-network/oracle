use std::ops::Sub;
use ic_cdk::export::{
    candid::CandidType,
    serde::{Deserialize, Serialize},
    Principal,
};
use canistergeek_ic_rust::{
    logger::{log_message},
    monitor::{collect_metrics},
};
use crate::*;

// todo: multi params in the future
#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Subscription {
    pub contract_address: String,
    pub method: String,
    pub abi: Vec<u8>,

    pub owner_address: Address, // H160
    pub execution_address: Address,
    // if execution_address is not topped up enough, then the subscription will be paused
    pub active: bool,
    pub last_execution: u64,
}

const MINIMUM_BALANCE: U256 = U256::from(10_000_000_000_000_000); // 0.01 ETH

pub async fn notify(price: f64) {
    let subscriptions = SUBSCRIPTIONS.with(|subscriptions| subscriptions.borrow().clone());

    ic_cdk::println!("notify subscribers");
    log_message(format!("notify subscribers"));

    for subscription in subscriptions.iter() {
        ic_cdk::println!("notify subscriber: {}", subscription.contract_address);
        log_message(format!("notify subscriber: {}", subscription.contract_address));

        update_price(
            subscription.contract_address.clone(),
            subscription.method.clone(),
            &subscription.abi.clone(),
            price,
        ).await.expect("Update price failed");
    }
}

pub async fn update_price(address: String, method: String, abi: &[u8], price: f64) -> Result<String, String> {
    // ecdsa key info
    let derivation_path = vec![ic_cdk::id().as_slice().to_vec()];
    let key_info = KeyInfo{ derivation_path, key_name: KEY_NAME.to_string() };

    let rpc_url = RPC.with(|rpc| rpc.borrow().clone());

    let w3 = match ICHttp::new(&rpc_url, None, None) {
        Ok(v) => { Web3::new(v) },
        Err(e) => { return Err(e.to_string()) },
    };
    let contract_address = Address::from_str(&address).unwrap();
    let contract = Contract::from_json(
        w3.eth(),
        contract_address,
        abi
    ).map_err(|e| {
        log_message(format!("Failed to create contract: {:?}", e));
        format!("init contract failed: {:?}", e)
    })?;

    let canister_addr = get_eth_addr(None, None, KEY_NAME.to_string())
        .await
        .map_err(|e| {
            log_message(format!("get canister eth addr failed: {}", e));
            format!("get canister eth addr failed: {}", e)
        })?;

    ic_cdk::println!("canister_addr: {}", canister_addr);
    log_message(format!("canister_addr: {}", canister_addr));

    // add nonce to options
    let tx_count = w3.eth()
        .transaction_count(canister_addr, None)
        .await
        .map_err(|e| {
            log_message(format!("get transaction count failed: {}", e));
            format!("get tx count error: {}", e)
        })?;
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
        op.transaction_type = Some(ic_web3::ethabi::ethereum_types::U64::from(2)) //EIP1559_TX_ID
    });

    ic_cdk::println!("Price from oracle: {}", price);
    log_message(format!("Price from oracle: {}", price));

    let chain_id = CHAIN_ID.with(|chain_id| chain_id.borrow().clone());

    let txhash = contract
        .signed_call(&method, (price.to_string(),), options, hex::encode(canister_addr), key_info, chain_id)
        .await
        .map_err(|e| {
            log_message(format!("token transfer failed: {}", e));
            format!("token transfer failed: {}", e)
        })?;

    ic_cdk::println!("txhash: {}", hex::encode(txhash));
    log_message(format!("txhash: {}", hex::encode(txhash)));

    Ok(format!("{}", hex::encode(txhash)))
}

#[update]
async fn verify_address_candid(msg: String, signature: String) -> (String, String) {
    let (owner_address, execution_address) = verify_address(msg, signature).await;

    return (hex::encode(owner_address), hex::encode(execution_address));
}

#[update]
async fn verify_address(siwe_msg: String, siwe_sig: String) -> Result<(Address,Address),String> {
    let opts = VerificationOpts {
        domain: None,
        nonce: None,
        timestamp: Some(OffsetDateTime::from_unix_timestamp((ic_cdk::api::time() / (1000 * 1000 * 1000)) as i64).unwrap())
    };

    let msg = Message::from_str(&siwe_msg).map_err(|e| e.to_string())?;
    let sig = <[u8; 65]>::from_hex(siwe_sig).map_err(|e| e.to_string())?;

    ic_cdk::println!("validate_address: msg: {:?}, sig: {:?}", msg, sig);

    msg.verify(&sig, &opts).await.map_err(|e| e.to_string())?;

    let factory_addr = FACTORY_ADDRESS.with(|f| Principal::from_text(f.borrow().clone()).unwrap());

    let canister_addr = get_eth_addr(Some(factory_addr), Some(vec![msg.address.to_vec()]), KEY_NAME.to_string())
        .await
        .map_err(|e| format!("get canister eth addr failed: {}", e))?;

    Ok((Address::from(msg.address), canister_addr))
}

#[update]
async fn subscribe(contract_address: String, method: String, message: String, signature: String) -> Result<String, String> {
    // verification
    let (owner_address, execution_address) = match verify_address(message, signature).await {
        Ok(_) => {},
        Err(e) => {
            ic_cdk::println!("verify address failed: {}", e);
            log_message(format!("verify address failed: {}", e));

            Err(e)
        }
    };

    let rpc_url = RPC.with(|rpc| rpc.borrow().clone());

    let w3 = match ICHttp::new(&rpc_url, None, None) {
        Ok(v) => { Web3::new(v) },
        Err(e) => { return Err(e.to_string()) },
    };
    let balance = w3.eth().balance(execution_address, None).await.map_err(|e| {
        ic_cdk::println!("get balance failed: {}", e);
        log_message(format!("get balance failed: {}", e));

        e
    })?;

    ic_cdk::println!("balance: {}", balance);
    log_message(format!("balance: {}", balance));

    if balance < MINIMUM_BALANCE {
        ic_cdk::println!("balance is not enough: {}", balance);
        log_message(format!("balance is not enough: {}", balance));

        return Err("balance is not enough".to_string());
    }

    let subscription = Subscription {
        contract_address,
        abi: ABI.to_vec(),
        method,
        owner_address,
        execution_address,
        active: true,
        last_execution: 0,
    };

    SUBSCRIPTIONS.with(|subscriptions| {
        subscriptions.borrow_mut().push(subscription);

        ic_cdk::println!("subscriptions: {:?}", map_subscriptions_to_show(subscriptions.borrow().clone()));
        log_message(format!("subscriptions: {:?}", map_subscriptions_to_show(subscriptions.borrow().clone())));
    });

    Ok("success".to_string())
}
