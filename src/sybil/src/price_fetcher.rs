use ic_cdk::api::call::CallResult;
use ic_cdk::api::call::{call_with_payment};
use std::convert::TryFrom;
use std::collections::HashMap;

use crate::*;

pub mod exchange_rate_canister {
    include!("exchange_rate_canister.rs");
}

pub async fn fetch_common_asset_prices(
    service: &exchange_rate_canister::SERVICE,
    pairs: Pairs,
) -> Result<Pairs, String> {
    let mut pairs_with_prices: Pairs = Pairs::new();
    
    // todo: make it parallel
    for mut pair in pairs {
        let request = exchange_rate_canister::GetExchangeRateRequest {
            timestamp: None,
            base_asset: exchange_rate_canister::Asset {
                class: exchange_rate_canister::AssetClass::Cryptocurrency,
                symbol: pair.base.to_string(),
            },
            quote_asset: exchange_rate_canister::Asset {
                class: exchange_rate_canister::AssetClass::FiatCurrency,
                symbol: pair.quote.to_string(),
            },
        };
        
        match service.get_exchange_rate(request).await {
            Ok((result,)) => match result {
                exchange_rate_canister::GetExchangeRateResult::Ok(exchange_rate) => {
                    ic_cdk::println!("Fetched exchange rate for {:?}: {:?}", pair, exchange_rate);
                    canistergeek_ic_rust::logger::log_message(format!("Fetched exchange rate for {:?}: {:?}", pair, exchange_rate));
                    
                    let rate_data = RateData {
                        rate: exchange_rate.rate,
                        timestamp: exchange_rate.timestamp,
                        decimals: exchange_rate.metadata.decimals,
                        base_asset_num_received_rates: exchange_rate.metadata.base_asset_num_received_rates,
                        base_asset_num_queried_sources: exchange_rate.metadata.base_asset_num_queried_sources,
                    };
                    
                    pair.rate_data = Some(rate_data);
                    
                    pairs_with_prices.push(pair);
                }
                exchange_rate_canister::GetExchangeRateResult::Err(err) => {
                    return Err(format!("Error fetching exchange rate for {:?}, {:?}", pair, err));
                }
            },
            Err((code, msg)) => {
                // missing code
                return Err(format!(
                    "Error during get_exchange_rate call for {:?}: {}",
                    pair, msg
                ));
            }
        }
    }
    
    Ok(pairs_with_prices)
}

#[update]
async fn execute_fetch_common_asset_prices() -> u64 {
    let canister_principal = STATE.with(|s| s.borrow().exchange_rate_canister.clone());
    
    let service = exchange_rate_canister::SERVICE(
        Principal::from_text(canister_principal).unwrap()
    );
    
    let trading_pairs = vec![
        Pair {
            id: "BTC/USD".to_string(),
            base: "BTC".to_string(),
            quote: "USD".to_string(),
            rate_data: None,
        },
        Pair {
            id: "ETH/USD".to_string(),
            base: "ETH".to_string(),
            quote: "USD".to_string(),
            rate_data: None,
        },
    ];
    
    match fetch_common_asset_prices(&service, trading_pairs).await {
        Ok(prices) => {
            ic_cdk::println!("Fetched prices: {:?}", prices);
            canistergeek_ic_rust::logger::log_message(format!("Fetched prices: {:?}", prices));
            
            // return btc price
            prices[0].rate_data.clone().unwrap().rate
        }
        Err(err) => {
            ic_cdk::println!("Error fetching prices: {}", err);
            canistergeek_ic_rust::logger::log_message(format!("Error fetching prices: {}", err));
    
            0
        }
    }
}
