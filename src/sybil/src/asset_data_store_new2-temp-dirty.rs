// Import the required crates
use ic_cdk::export::candid::{CandidType, Deserialize};
use rs_merkle::{Hasher, MerkleTree, MerkleProof};
use serde::{Deserialize as SerdeDeserialize, Serialize};
use std::collections::HashMap;
use tiny_keccak::{Hasher as KeccakHasher, Keccak, Sha3};
use hex;

type Hash = [u8; 32];

// Define the AssetData structure
#[derive(Clone, Debug, Serialize, SerdeDeserialize, CandidType, PartialEq)]
pub struct AssetData {
    symbol: String,
    price: u64,
    timestamp: u64,
}

impl AssetData {
    // fn hash(&self) -> [u8; 32] {
    //     let mut hasher = Keccak::v256();
    //     let mut output = [0u8; 32];
    //     hasher.update(self.symbol.as_bytes());
    //     hasher.update(&self.price.to_be_bytes());
    //     hasher.update(&self.timestamp.to_be_bytes());
    //     hasher.finalize(&mut output);
    //     output
    // }
    
    fn hash(&self) -> [u8; 32] {
        let mut buffer = Vec::new();
        buffer.extend_from_slice(self.symbol.as_bytes());
        buffer.extend_from_slice(&self.price.to_be_bytes());
        buffer.extend_from_slice(&self.timestamp.to_be_bytes());
        
        Keccak256Algorithm::hash(&buffer)
    }
    
    fn to_leaf(&self) -> [u8; 32] {
        let mut buffer = Vec::new();
        buffer.extend_from_slice(self.symbol.as_bytes());
        buffer.extend_from_slice(&self.price.to_be_bytes());
        buffer.extend_from_slice(&self.timestamp.to_be_bytes());
        
        let mut output = [0u8; 32];
        let buffer_len = buffer.len();
        output[..buffer_len].copy_from_slice(&buffer);
        output
    }
}

#[derive(Clone)]
pub struct Keccak256Algorithm {}

impl Hasher for Keccak256Algorithm {
    type Hash = [u8; 32];
    
    fn hash(data: &[u8]) -> Hash {
        let mut hasher = Keccak::v256();
        let mut output = [0u8; 32];
        // println!("hello motherfucker: data: {:?}", hex::encode(data));
        
        hasher.update(data);
        hasher.finalize(&mut output);
        output
    }
}

// Define the AssetDataStore structure
pub struct AssetDataStore {
    merkle_tree: MerkleTree<Keccak256Algorithm>,
    data_store: HashMap<String, AssetData>,
    symbol_index: HashMap<String, usize>,
}

impl AssetDataStore {
    pub fn new() -> Self {
        Self {
            merkle_tree: MerkleTree::new(),
            data_store: HashMap::new(),
            symbol_index: HashMap::new(),
        }
    }
    
    pub fn add_batch_asset_data(&mut self, batch_asset_data: Vec<AssetData>) {
        let mut batch_data = Vec::new();
        
        for asset_data in batch_asset_data {
            let asset_data_hash = asset_data.hash();
            
            let index = self.data_store.len();
            self.data_store.insert(asset_data.symbol.clone(), asset_data.clone());
            self.symbol_index.insert(asset_data.symbol.clone(), index);
            
            batch_data.push(asset_data_hash);
        }
        
        self.merkle_tree.append(&mut batch_data);
        self.merkle_tree.commit();
    }
    
    pub fn get_asset_data(&self, symbol: &str) -> Option<&AssetData> {
        self.data_store.get(symbol)
    }
    
    pub fn get_root(&self) -> Option<Hash> {
        self.merkle_tree.root()
    }
    
    pub fn generate_proof(&self, symbol: &str) -> Option<Hash> {
        let index = self.symbol_index.get(symbol)?;
        
        println!("index: {:?}", index);
        // println!("proof(1): {:?}", self.merkle_tree.proof(&[*index]).proof_hashes());
        // println!("proof(1): {:?}", self.merkle_tree.proof(&[*index]).proof_hashes()[0]);
        
        Some(self.merkle_tree.proof(&[*index]).proof_hashes()[0])
    }
    
    pub fn verify_proof(&self, proof_hashes: &[Hash], root: Hash, symbol: &str) -> Option<bool> {
        let index = self.symbol_index.get(symbol)?;
        let asset_data = self.data_store.get(symbol)?;
        let leaf = asset_data.hash();
        // let leaf = asset_data.to_leaf();
        let leaf_hash = Keccak256Algorithm::hash(&leaf);
        
        
        let proof = MerkleProof::<Keccak256Algorithm>::new(proof_hashes.to_vec());
        
        println!("asset_data: {:?}", asset_data);
        println!("symbol: {:?}", symbol);
        println!("proof(2): {:?}", proof.proof_hashes());
        println!("root: {:?}", root);
        
        let proof_hex = hex::encode(proof.proof_hashes()[0]);
        println!("proof_hex: {:?}", proof_hex);
        let root_hex = hex::encode(root);
        println!("root_hex: {:?}", root_hex);
        
        println!("leaf: {:?}", hex::encode(leaf));
        println!("leaf_hash: {:?}", hex::encode(leaf_hash));
        
        Some(proof.verify(root, &[*index], &[leaf], self.data_store.len()))
    }
}

// pub fn generate_proof_batch(&self, symbols: &[&str]) -> Option<Vec<Hash>> {
//     let mut indices = vec![];
// 
//     for symbol in symbols {
//         let index = self.symbol_index.get(symbol.clone())?;
//         
//         indices.push(*index);
//     }
//     
//     println!("indices: {:?}", indices);
// 
//     let proof = self.merkle_tree.proof(&indices);
//     
//     println!("proof: {:?}", proof.proof_hashes());
//     println!("proof: {:?}", proof.proof_hashes().to_vec());
//     
//     Some(proof.proof_hashes().to_vec())
// }

// pub fn generate_proof_batch(&self, symbols: &[&str]) -> Option<Vec<Hash>> {
//     let mut proof_hashes = Vec::new();
//     
//     for symbol in symbols {
//         let proof_hash = self.generate_proof(symbol)?;
//         proof_hashes.push(proof_hash);
//     }
//     
//     Some(proof_hashes)
// }

#[cfg(test)]
mod tests {
    use super::*;
    
    fn create_sample_data() -> Vec<AssetData> {
        vec![
            AssetData {
                symbol: "BTC".to_string(),
                price: 45000,
                timestamp: 1_000_000,
            },
            AssetData {
                symbol: "ETH".to_string(),
                price: 3000,
                timestamp: 1000000,
            },
        ]
    }
    
    #[test]
    fn test_add_batch_asset_data() {
        let mut store = AssetDataStore::new();
        let data = create_sample_data();
        
        store.add_batch_asset_data(data.clone());
        
        assert_eq!(store.get_asset_data("BTC"), Some(&data[0]));
        assert_eq!(store.get_asset_data("ETH"), Some(&data[1]));
    }
    
    #[test]
    fn test_generate_and_verify_proof() {
        let mut store = AssetDataStore::new();
        let data = create_sample_data();
        
        store.add_batch_asset_data(data.clone());
        
        let root = store.get_root().unwrap();
        
        let proof_btc = store.generate_proof("BTC").unwrap();
        let proof_eth = store.generate_proof("ETH").unwrap();
        
        // println!("{:?}", proof_btc);
        // println!("{:?}", proof_eth);
        
        assert_eq!(
            store.verify_proof(&[proof_btc], root, "BTC"),
            Some(true)
        );
        assert_eq!(
            store.verify_proof(&[proof_eth], root, "ETH"),
            Some(true)
        );
    }
    
    // #[test]
    // fn test_generate_proof_batch_and_verify_proof() {
    //     let mut store = AssetDataStore::new();
    //     let data = create_sample_data();
    //     
    //     store.add_batch_asset_data(data.clone());
    //     
    //     let root = store.get_root().unwrap();
    //     
    //     let proof_hashes = store.generate_proof_batch(&["BTC", "ETH"]).unwrap();
    //     
    //     println!("proof_hashes: {:?}", proof_hashes);
    //     
    //     assert_eq!(
    //         store.verify_proof(&proof_hashes, root, "BTC"),
    //         Some(true)
    //     );
    //     assert_eq!(
    //         store.verify_proof(&proof_hashes, root, "ETH"),
    //         Some(true)
    //     );
    // }
}

