use candid::types::Type::Principal;
use crate::*;
use crate::state::{get_exchange_rate_canister, get_pairs};
use crate::price_fetcher::{exchange_rate_canister, fetch_common_asset_prices};
use crate::asset_data_store::{AssetData, AssetDataStore};

struct Timer {
    timer_id: Option<TimerId>,
    interval: Duration,
    asset_data_store: AssetDataStore,
}

fn map_pairs_to_asset_data(pairs: Pairs) -> Vec<AssetData> {
    let mut asset_data = Vec::new();
    
    for pair in pairs {
        let rate_data = pair.rate_data.unwrap();
        
        asset_data.push(AssetData {
            symbol: pair.id,
            price: rate_data.rate,
            timestamp: rate_data.timestamp,
            decimals: rate_data.decimals as u64,
        });
    }
    
    asset_data
}

impl Timer {
    fn new(interval: Duration) -> Self {
        let asset_data_store = AssetDataStore::new();
        
        Timer { timer_id: None, interval, asset_data_store }
    }
    
    fn reset(&mut self) {
        self.stop();
        
        self.start();
    }
    
    fn stop(&mut self) {
        clear_timer(self.timer_id.unwrap());
    }
    
    fn start(&mut self) {
        let service = exchange_rate_canister::SERVICE(
            Principal::from_text(get_exchange_rate_canister()).unwrap()
        );
    
        let timer_id = set_timer_interval(interval, ic_cdk::spawn(
            self.fetch_prices_and_send_transactions(service)
        ));
        
        self.timer_id = Some(timer_id);
    }
    
    fn set_interval(&mut self, interval: Duration) {
        self.interval = interval;
        
        self.reset();
    }
 
    async fn fetch_prices_and_send_transactions(&mut self, service: exchange_rate_canister::SERVICE) {
        let pairs = get_pairs();
     
        // fetch prices of pairs
        let pairs_with_prices = match fetch_common_asset_prices(&service, pairs).await {
            Ok(prices) => {
                ic_cdk::println!("Fetched prices: {:?}", prices);
                
                prices
            }
            Err(err) => {
                ic_cdk::println!("Error fetching prices: {}", err);
            }
        };
        
        let asset_data = map_pairs_to_asset_data(pairs_with_prices);
        
        // store prices in merkle tree
        self.asset_data_store.clear();
        self.asset_data_store.add_batch_asset_data(asset_data);
        
        let root = self.asset_data_store.get_uncommitted_root_hex().unwrap();
        
        // send transactions to chains with new root hash
        // ...
        
        // commit merkle tree (only after transactions are sent and applied)
        self.asset_data_store.commit();
    }
    
    // fetching on demand
    pub fn get_asset_data_with_proof(&self, symbol: &str) -> Option<(&AssetData, Vec<String>)> {
        let asset_data = match self.asset_data_store.get_asset_data(symbol) {
            Some(asset_data) => asset_data,
            None => None,
        };
        
        let proof = self.asset_data_store.generate_proof_hex(symbol).unwrap();
        
        Some((asset_data, proof))
    }
}
