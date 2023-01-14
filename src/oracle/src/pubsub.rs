use crate::*;

// todo: multi params in the future
#[derive(Debug, Clone)]
pub struct Subscription {
    pub contract_address: String,
    pub method: String,
    pub abi: Vec<u8>,
}

pub async fn notify(price: f64) {
    let subscriptions = SUBSCRIPTIONS.with(|subscriptions| subscriptions.borrow().clone());

    ic_cdk::println!("notify subscribers");

    for subscription in subscriptions.iter() {
        ic_cdk::println!("notify subscriber: {}", subscription.contract_address);

        update_price(
            subscription.contract_address.clone(),
            subscription.method.clone(),
            &subscription.abi.clone(),
            price,
        ).await.expect("TODO: panic message");
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
    ).map_err(|e| format!("init contract failed: {}", e))?;

    let canister_addr = get_eth_addr(None, None, KEY_NAME.to_string())
        .await
        .map_err(|e| format!("get canister eth addr failed: {}", e))?;

    ic_cdk::println!("canister_addr: {}", canister_addr);

    // add nonce to options
    let tx_count = w3.eth()
        .transaction_count(canister_addr, None)
        .await
        .map_err(|e| format!("get tx count error: {}", e))?;
    // get gas_price
    let gas_price = w3.eth()
        .gas_price()
        .await
        .map_err(|e| format!("get gas_price error: {}", e))?;
    // legacy transaction type is still ok
    let options = Options::with(|op| {
        op.nonce = Some(tx_count);
        op.gas_price = Some(gas_price);
        op.transaction_type = Some(ic_web3::ethabi::ethereum_types::U64::from(2)) //EIP1559_TX_ID
    });

    ic_cdk::println!("Price from oracle: {}", price);

    let chain_id = CHAIN_ID.with(|chain_id| chain_id.borrow().clone());

    let txhash = contract
        .signed_call(&method, (price.to_string(),), options, hex::encode(canister_addr), key_info, chain_id)
        .await
        .map_err(|e| format!("token transfer failed: {}", e))?;

    ic_cdk::println!("txhash: {}", hex::encode(txhash));

    Ok(format!("{}", hex::encode(txhash)))
}
