use std::collections::HashMap;
use hex;

use crate::merkle_tree::MerkleTree;

#[derive(Clone, Debug, PartialEq)]
pub struct AssetData {
    symbol: String,
    price: u64,
    timestamp: u64,
}

pub struct AssetDataStore {
    asset_data_map: HashMap<String, AssetData>,
    merkle_tree: MerkleTree,
}

fn asset_data_to_leaf(asset_data: &AssetData) -> Vec<u8> {
    let mut leaf = asset_data.symbol.as_bytes().to_vec();
    leaf.extend(&asset_data.price.to_be_bytes());
    leaf.extend(&asset_data.timestamp.to_be_bytes());
    
    leaf
}

impl AssetDataStore {
    pub fn new() -> Self {
        Self {
            asset_data_map: HashMap::new(),
            merkle_tree: MerkleTree::default(),
        }
    }
    
    pub fn add_batch_asset_data(&mut self, batch_asset_data: Vec<AssetData>) {
        let mut leaves = Vec::with_capacity(batch_asset_data.len());
        
        for asset_data in batch_asset_data {
            let symbol = asset_data.symbol.clone();
            leaves.push(asset_data_to_leaf(&asset_data));
            self.asset_data_map.insert(symbol, asset_data);
        }
        
        self.merkle_tree = MerkleTree::new(&leaves);
    }
    
    pub fn get_asset_data(&self, symbol: &str) -> Option<&AssetData> {
        self.asset_data_map.get(symbol)
    }
    
    pub fn get_root(&self) -> &[u8] {
        self.merkle_tree.root.as_slice()
    }
    
    pub fn generate_proof(&self, symbol: &str) -> Option<Vec<Vec<u8>>> {
        self.asset_data_map.get(symbol).and_then(|asset_data| {
            self.merkle_tree
                .generate_proof(
                    asset_data_to_leaf(asset_data)
                )
        })
    }
    
    pub fn verify_proof(&self, proof: &[Vec<u8>], root: &[u8], symbol: &str) -> bool {
        match self.asset_data_map.get(symbol) {
            Some(asset_data) => {
                self.merkle_tree
                    .verify_proof(
                        proof,
                        root,
                        asset_data_to_leaf(asset_data)
                    )
            }
            None => false,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    fn create_sample_data() -> Vec<AssetData> {
        vec![
            AssetData {
                symbol: "BTC".to_string(),
                price: 50000,
                timestamp: 1000000000,
            },
            AssetData {
                symbol: "ETH".to_string(),
                price: 3000,
                timestamp: 1000000000,
            },
            AssetData {
                symbol: "LTC".to_string(),
                price: 200,
                timestamp: 1000000000,
            },
        ]
    }
    
    #[test]
    fn test_add_batch_asset_data() {
        let sample_data = create_sample_data();
        let mut store = AssetDataStore::new();
        
        store.add_batch_asset_data(sample_data.clone());
        
        for asset_data in sample_data {
            let stored_data = store.get_asset_data(&asset_data.symbol);
            assert_eq!(stored_data, Some(&asset_data));
        }
    }
    
    #[test]
    fn test_generate_and_verify_proof() {
        let sample_data = create_sample_data();
        let mut store = AssetDataStore::new();
        store.add_batch_asset_data(sample_data.clone());
        
        let root = store.get_root();
        
        for asset_data in sample_data {
            let symbol = asset_data.symbol.clone();
            let proof = store.generate_proof(&symbol).unwrap();
            
            let is_valid = store.verify_proof(&proof, root, &symbol);
            
            println!("symbol: {}", symbol);
            
            let proof_hex = proof.iter().map(|x| hex::encode(x)).collect::<Vec<String>>();
            println!("proof: {:?}", proof_hex);
            println!("root: {}", hex::encode(root));
            println!("is_valid: {}", is_valid);
            
            assert!(is_valid);
        }
    }
    
    #[test]
    fn test_verify_proof_wrong_root() {
        let sample_data = create_sample_data();
        let mut store = AssetDataStore::new();
        store.add_batch_asset_data(sample_data.clone());
        
        let wrong_root = b"wrong_root";
        
        for asset_data in sample_data {
            let symbol = asset_data.symbol.clone();
            let proof = store.generate_proof(&symbol).unwrap();
            
            assert!(!store.verify_proof(&proof, wrong_root, &symbol));
        }
    }
    
    #[test]
    fn test_verify_proof_wrong_symbol() {
        let sample_data = create_sample_data();
        let mut store = AssetDataStore::new();
        store.add_batch_asset_data(sample_data.clone());
        
        let root = store.get_root();
        
        let wrong_symbol = "XRP";
        
        let proof = store.generate_proof(wrong_symbol);
        assert!(proof.is_none());
    }
}
