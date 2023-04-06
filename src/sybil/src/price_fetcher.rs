use ic_cdk::api::call::CallResult;
use ic_cdk::api::call::{call_with_payment};
use std::convert::TryFrom;
use std::collections::HashMap;

use crate::*;

pub mod exchange_rate_canister {
    include!("exchange_rate_canister.rs");
}

async fn fetch_common_asset_prices(
    service: &exchange_rate_canister::SERVICE,
    pairs: Vec<String>,
) -> Result<HashMap<String, u64>, String> {
    let mut prices: HashMap<String, u64> = HashMap::new();
    
    for pair in pairs {
        let assets: Vec<&str> = pair.split('/').collect();
        if assets.len() != 2 {
            return Err(format!("Invalid trading pair format: {}", pair));
        }
    
        let base_asset = assets[0];
        let quote_asset = assets[1];
    
        let request = exchange_rate_canister::GetExchangeRateRequest {
            timestamp: None,
            base_asset: exchange_rate_canister::Asset {
                class: exchange_rate_canister::AssetClass::Cryptocurrency,
                symbol: base_asset.to_string(),
            },
            quote_asset: exchange_rate_canister::Asset {
                class: exchange_rate_canister::AssetClass::FiatCurrency,
                symbol: quote_asset.to_string(),
            },
        };
        
        match service.get_exchange_rate(request).await {
            Ok((result,)) => match result {
                exchange_rate_canister::GetExchangeRateResult::Ok(exchange_rate) => {
                    ic_cdk::println!("Fetched exchange rate for {}: {:?}", pair, exchange_rate);
                    
                    prices.insert(pair.clone(), exchange_rate.rate);
                }
                exchange_rate_canister::GetExchangeRateResult::Err(err) => {
                    return Err(format!("Error fetching exchange rate for {}, {:?}", pair, err));
                }
            },
            Err((code, msg)) => {
                // missing code
                return Err(format!(
                    "Error during get_exchange_rate call for {}: {}",
                    pair, msg
                ));
            }
        }
    }
    
    Ok(prices)
}

#[update]
async fn execute_fetch_common_asset_prices() -> u64 {
    let canister_principal = STATE.with(|s| s.borrow().exchange_rate_canister.clone());
    
    let service = exchange_rate_canister::SERVICE(
        Principal::from_text(canister_principal).unwrap()
    );
    
    let trading_pairs = vec!["BTC/USD".to_string(), "ETH/USD".to_string()];
    
    match fetch_common_asset_prices(&service, trading_pairs).await {
        Ok(prices) => {
            ic_cdk::println!("Fetched prices: {:?}", prices);
            
            let btc_price = prices.get("BTC/USD").unwrap();
            let eth_price = prices.get("ETH/USD").unwrap();
            
            btc_price.clone()
        }
        Err(err) => {
            ic_cdk::println!("Error fetching prices: {}", err);
    
            0.0
        }
    }
}
