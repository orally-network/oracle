use std::time::Duration;
use std::sync::{Arc, Mutex};

use crate::*;
use crate::state::{get_exchange_rate_canister, get_pairs, get_chains, get_asset_data_store, update_asset_data_store, set_pairs};
use crate::price_fetcher::{exchange_rate_canister, fetch_common_asset_prices};
use crate::asset_data_store::{AssetData, AssetDataStore};
use crate::evm_interaction::{send_transactions};

// pub struct Timer {
//     timer_id: Option<TimerId>,
//     interval: u64,
//     asset_data_store: AssetDataStore,
// }

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

pub fn run_timer(interval: u64) {
    let timer_func = {
        move || ic_cdk::spawn(
            fetch_prices_and_send_transactions()
        )
    };
    
    timer_func();
    
    set_timer_interval(Duration::from_secs(interval), timer_func);
}

pub async fn fetch_prices_and_send_transactions() {
    let service = exchange_rate_canister::SERVICE(
        Principal::from_text(get_exchange_rate_canister()).unwrap()
    );
    
    let pairs = get_pairs();
    
    // fetch prices of pairs
    let pairs_with_prices = match fetch_common_asset_prices(&service, pairs).await {
        Ok(prices) => {
            ic_cdk::println!("Fetched prices:! {:?}", prices);
            
            prices
        }
        Err(err) => {
            ic_cdk::trap(&*format!("Error fetching prices: {}", err));
        }
    };
    
    set_pairs(pairs_with_prices.clone());
    
    let asset_data = map_pairs_to_asset_data(pairs_with_prices.clone());
    
    ic_cdk::println!("asset_data: {:?}, pairs_with_prices.: {:?}", asset_data, pairs_with_prices.clone());
    
    // store prices in merkle tree
    let mut asset_data_store = AssetDataStore::new(asset_data);
    
    let root = asset_data_store.get_root();
    
    // // -- test
    // let proof_btc = asset_data_store.generate_proof("ICP/USD").unwrap();
    // let proof = MerkleProof::<Keccak256Algorithm>::from_bytes(proof_btc.as_slice()).ok().unwrap();
    // 
    // let data_btc = asset_data_store.get_asset_data("ICP/USD").unwrap();
    // 
    // ic_cdk::println!("proof_hex: {:?}, data_btc: {:?}, root1: {:?}", proof.proof_hashes_hex(), data_btc, hex::encode(root.clone()));
    // // println!("proof: {:?}", proof_btc);
    // // --
    
    // send transactions to chains with new root hash
    let chains = get_chains();
    
    let result_hashes = send_transactions(chains, root).await;
    
    ic_cdk::println!("Sent transactions: {:?}", result_hashes);
    
    // commit merkle tree (only after transactions are sent and applied)
    // asset_data_store.commit();
    
    update_asset_data_store(asset_data_store);
}

// impl Timer {
//     pub fn new(interval: u64) -> Arc<Mutex<Self>> {
//         let asset_data_store = AssetDataStore::new();
//         
//         Arc::new(Mutex::new(Timer {
//             timer_id: None,
//             interval,
//             asset_data_store,
//         }))
//     }
//     
//     pub fn reset(timer_instance: Arc<Mutex<Self>>) {
//         Self::stop(timer_instance.clone());
//         Self::start(timer_instance);
//     }
//     
//     pub fn stop(timer_instance: Arc<Mutex<Self>>) {
//         let mut timer = timer_instance.lock().unwrap();
//         clear_timer(timer.timer_id.unwrap());
//     }
//     
//     pub fn start(timer_instance: Arc<Mutex<Self>>) {
//         let timer_func = {
//             let timer_instance = timer_instance.clone();
//             move || {
//                 let timer_instance_clone = timer_instance.clone();
//                 ic_cdk::spawn(async move {
//                     let mut timer = timer_instance_clone.lock().unwrap();
//                     timer.fetch_prices_and_send_transactions().await;
//                 });
//             }
//         };
//         
//         timer_func();
//         
//         let interval = timer_instance.lock().unwrap().interval;
//         let timer_id = set_timer_interval(Duration::from_secs(interval), timer_func);
//         
//         timer_instance.lock().unwrap().timer_id = Some(timer_id);
//     }
//     
//     pub fn set_interval(timer_instance: Arc<Mutex<Self>>, interval: u64) {
//         timer_instance.lock().unwrap().interval = interval;
//         Self::reset(timer_instance);
//     }
//     
//     async fn fetch_prices_and_send_transactions(&mut self) {
//         let service = exchange_rate_canister::SERVICE(
//             Principal::from_text(get_exchange_rate_canister()).unwrap()
//         );
//         
//         let pairs = get_pairs();
//         
//         // fetch prices of pairs
//         let pairs_with_prices = match fetch_common_asset_prices(&service, pairs).await {
//             Ok(prices) => {
//                 ic_cdk::println!("Fetched prices: {:?}", prices);
//                 
//                 prices
//             }
//             Err(err) => {
//                 ic_cdk::trap(&*format!("Error fetching prices: {}", err));
//             }
//         };
//         
//         let asset_data = map_pairs_to_asset_data(pairs_with_prices);
//         
//         // store prices in merkle tree
//         self.asset_data_store.clear();
//         self.asset_data_store.add_batch_asset_data(asset_data);
//         
//         // commit merkle tree after root applied to all chains
//         let root = self.asset_data_store.get_uncommitted_root_hex().unwrap();
//         
//         // send transactions to chains with new root hash
//         let chains = get_chains();
//     
//         let result_hashes = send_transactions(chains, root).await;
//         
//         ic_cdk::println!("Sent transactions: {:?}", result_hashes);
//         
//         // commit merkle tree (only after transactions are sent and applied)
//         self.asset_data_store.commit();
//     }
//     
//     // fetching on demand
//     pub fn get_asset_data_with_proof(&self, symbol: &str) -> Option<(&AssetData, Vec<String>)> {
//         let asset_data = match self.asset_data_store.get_asset_data(symbol) {
//             Some(asset_data) => asset_data,
//             None => {
//                 ic_cdk::trap(&format!("Asset data for symbol {} not found", symbol));
//             },
//         };
//         
//         let proof = self.asset_data_store.generate_proof_hex(symbol).unwrap();
//         
//         Some((asset_data, proof))
//     }
// }
