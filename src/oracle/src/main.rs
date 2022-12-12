use candid::candid_method;
use ic_cdk_macros::{self, update, query};
use std::str::FromStr;
use ic_cdk::export::{Principal};
use serde::{Deserialize, Serialize};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse, TransformArgs,
    TransformContext,
};
use ic_cdk::api::call::RejectionCode;
use serde_json::{self, Value};

use ic_web3::transports::ICHttp;
use ic_web3::Web3;
use ic_web3::ic::{get_eth_addr, KeyInfo};
use ic_web3::{
    contract::{Contract, Options},
    ethabi::ethereum_types::{U64, U256},
    types::{Address, TransactionParameters, BlockId, BlockNumber},
};

const URL: &str = "https://eth-goerli.g.alchemy.com/v2/bUH5A9MJ6basJ88Hq85y23Ada8CYSvD4";
const CHAIN_ID: u64 = 5;
const KEY_NAME: &str = "dfx_test_key";
const TOKEN_ABI: &[u8] = include_bytes!("./contracts/icp_price_abi.json");
const CONTRACT_ADDRESS: &str = "0xCFf00E5f685cCE94Dfc6d1a18200c764f9BCca1f";
const MAX_RESPONSE_BYTES: u64 = 500_000;

type Result<T, E> = std::result::Result<T, E>;

#[update]
async fn get_address() -> Result<String, String> {
    let canister_addr = get_eth_addr(None, None, KEY_NAME.to_string())
        .await
        .map_err(|e| format!("get canister eth addr failed: {}", e))?;

    Ok(hex::encode(canister_addr))
}

async fn send_request(host: String, url: String, method: HttpMethod, body: Option<Vec<u8>>) -> Result<String, (RejectionCode, String)> {
    let mut host_header = host.clone().to_owned();
    host_header.push_str(":443");

    let request_headers = vec![
        HttpHeader {
            name: "Host".to_string(),
            value: host_header,
        },
        HttpHeader {
            name: "User-Agent".to_string(),
            value: "oracle_canister".to_string(),
        },
    ];

    let request = CanisterHttpRequestArgument {
        url: url.clone(),
        method,
        body,
        max_response_bytes: Some(MAX_RESPONSE_BYTES),
        transform: Some(TransformContext::new(transform, vec![])),
        headers: request_headers,
    };

    ic_cdk::api::print(format!("Requesting url: {}", url.to_string()));

    match http_request(request).await {
        Ok((response, )) => {
            ic_cdk::api::print(format!("Response status: {}", response.status));

            let decoded_body = String::from_utf8(response.body)
                .expect("Remote service response is not UTF-8 encoded.");

            ic_cdk::api::print(format!("Response body: {}", decoded_body));

            Ok(decoded_body)
        },
        Err((code, message)) => {
            ic_cdk::api::print(format!("Error: {}", message));
            Err((code, message))
        }
    }
}

#[update(name = "fetch_price")]
#[candid_method(update, rename = "fetch_price")]
async fn fetch_price() -> Result<String, String> {
    let host = "api.pro.coinbase.com".to_string();

    let url = format!("https://{host}/products/ICP-USD/stats");
    ic_cdk::api::print(url.clone());

    match send_request(host, url, HttpMethod::GET, None).await {
        Ok(response) => {
            ic_cdk::api::print(format!("Response from fetch_price: {}", response));

            let response_obj: Value = serde_json::from_str(&response).unwrap();

            ic_cdk::api::print(format!("Price: {}", response_obj["last"]));

            Ok(response_obj["last"].to_string())
        }
        Err((code, message)) => {
            let f_message =
                format!("The http_request resulted into error. RejectionCode: {code:?}, Error: {message}");
            ic_cdk::api::print(f_message.clone());

            Err(message)
        }
    }
}

#[update(name = "update_price")]
#[candid_method(update, rename = "update_price")]
async fn update_price() -> Result<String, String> {
    // ecdsa key info
    let derivation_path = vec![ic_cdk::id().as_slice().to_vec()];
    let key_info = KeyInfo{ derivation_path: derivation_path, key_name: KEY_NAME.to_string() };

    let w3 = match ICHttp::new(URL, None, None) {
        Ok(v) => { Web3::new(v) },
        Err(e) => { return Err(e.to_string()) },
    };
    let contract_address = Address::from_str(&CONTRACT_ADDRESS).unwrap();
    let contract = Contract::from_json(
        w3.eth(),
        contract_address,
        TOKEN_ABI
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

    let price = fetch_price()
        .await
        .map_err(|e| format!("fetch_price error: {}", e))?;

    ic_cdk::println!("Price from oracle: {}", price);

    let txhash = contract
        .signed_call("set_price", (price,), options, hex::encode(canister_addr), key_info, CHAIN_ID)
        .await
        .map_err(|e| format!("token transfer failed: {}", e))?;

    ic_cdk::println!("txhash: {}", hex::encode(txhash));

    Ok(format!("{}", hex::encode(txhash)))
}

#[query]
fn transform(raw: TransformArgs) -> HttpResponse {
    let mut sanitized = raw.response.clone();
    sanitized.headers = vec![
        HttpHeader {
            name: "Content-Security-Policy".to_string(),
            value: "default-src 'self'".to_string(),
        },
        HttpHeader {
            name: "Referrer-Policy".to_string(),
            value: "strict-origin".to_string(),
        },
        HttpHeader {
            name: "Permissions-Policy".to_string(),
            value: "geolocation=(self)".to_string(),
        },
        HttpHeader {
            name: "Strict-Transport-Security".to_string(),
            value: "max-age=63072000".to_string(),
        },
        HttpHeader {
            name: "X-Frame-Options".to_string(),
            value: "DENY".to_string(),
        },
        HttpHeader {
            name: "X-Content-Type-Options".to_string(),
            value: "nosniff".to_string(),
        },
    ];
    sanitized
}

fn main() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
