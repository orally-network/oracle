// Import the required crates
use ic_cdk::export::candid::{CandidType, Deserialize};
use rs_merkle::{Hasher, MerkleTree, MerkleProof};
use serde::{Deserialize as SerdeDeserialize, Serialize};
use std::collections::HashMap;
use tiny_keccak::{Hasher as KeccakHasher, Keccak, Sha3};

type Hash = [u8; 32];

// Define the AssetData structure
#[derive(Clone, Debug, Serialize, SerdeDeserialize, CandidType)]
pub struct AssetData {
    symbol: String,
    price: f64,
    timestamp: u64,
}

impl AssetData {
    fn hash(&self) -> [u8; 32] {
        let mut hasher = Keccak::v256();
        let mut output = [0u8; 32];
        hasher.update(self.symbol.as_bytes());
        hasher.update(&self.price.to_be_bytes());
        hasher.update(&self.timestamp.to_be_bytes());
        hasher.finalize(&mut output);
        output
    }
}

#[derive(Clone)]
pub struct Keccak256Algorithm {}

impl Hasher for Keccak256Algorithm {
    type Hash = [u8; 32];
    
    fn hash(data: &[u8]) -> Hash {
        let mut hasher = Sha3::v256();
        let mut output = [0u8; 32];
        
        hasher.update(data);
        hasher.finalize(&mut output);
        output
    }
}

// Define the AssetDataStore structure
pub struct AssetDataStore {
    merkle_tree: MerkleTree<Keccak256Algorithm>,
    data_store: HashMap<String, AssetData>,
}

impl AssetDataStore {
    pub fn new() -> Self {
        Self {
            merkle_tree: MerkleTree::new(),
            data_store: HashMap::new(),
        }
    }
    
    pub fn add_batch_asset_data(&mut self, batch_asset_data: Vec<AssetData>) {
        let mut batch_data = Vec::new();
        
        for asset_data in batch_asset_data {
            let asset_data_hash = asset_data.hash();
            
            self.data_store.insert(asset_data.symbol.clone(), asset_data.clone());
            
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
    
    pub fn generate_proof_batch(&self, symbols: &[&str]) -> &[Hash] {
        let mut indices = Vec::new();
        
        for symbol in symbols {
            let index = self.data_store.keys().position(|s| s == symbol).unwrap();
            
            indices.push(index);
        }
    
        self.merkle_tree.proof(&indices).proof_hashes()
    }
    
    pub fn generate_proof(&self, symbol: &str) -> Option<Hash> {
        let index = self.data_store.keys().position(|s| s == symbol)?;
        
        self.merkle_tree.proof(&[index]).proof_hashes().get(0).cloned()
    }
    
    pub fn verify_proof(&self, proof_hash: Hash, root: Hash, leave: Hash) -> bool {
        let proof = MerkleProof::<Keccak256Algorithm>::new(Vec::from([proof_hash]));
        
        // find index of the leave
        let index = self.data_store.values().position(|s| s.hash() == leave).unwrap();
        
        proof.verify(root, &[index], &[leave], self.data_store.len())
    }
}