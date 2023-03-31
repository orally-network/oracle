use merkletree::merkle::{MerkleTree};
use merkletree::store::{Store, VecStore};
use merkletree::proof::Proof;
use std::collections::HashMap;
use std::fmt;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct AssetData {
    symbol: String,
    price: f64,
    timestamp: u64,
}

impl fmt::Display for AssetData {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "symbol: {}, price: {:.2}, timestamp: {}",
            self.symbol, self.price, self.timestamp
        )
    }
}

pub struct AssetDataStore {
    data: HashMap<String, AssetData>,
    tree: MerkleTree<[u8; 32], Sha256, VecStore<[u8; 32]>>,
}

impl AssetDataStore {
    pub fn new() -> Self {
        AssetDataStore {
            data: HashMap::new(),
            tree: MerkleTree::<[u8; 32], Sha256, VecStore<[u8; 32]>>::new(VecStore::new()),
        }
    }
    
    pub fn regenerate(&mut self, new_asset_prices: Vec<AssetData>) {
        self.data.clear();
        for asset_data in new_asset_prices {
            self.data.insert(asset_data.symbol.clone(), asset_data.clone());
        }
        self.generate_merkle_tree();
    }
    
    fn generate_merkle_tree(&mut self) {
        let leaf_hashes: Vec<[u8; 32]> = self.data.values().map(|asset_data| {
            self.compute_hash(asset_data)
        }).collect();
        
        self.tree = MerkleTree::<[u8; 32], Sha256, VecStore<[u8; 32]>>::from_data(leaf_hashes).unwrap();
    }
    
    fn compute_hash(&self, asset_data: &AssetData) -> [u8; 32] {
        let mut hasher = Sha256::new();
        hasher.update(asset_data.symbol.as_bytes());
        hasher.update(&asset_data.price.to_be_bytes());
        hasher.update(&asset_data.timestamp.to_be_bytes());
        hasher.finalize().into()
    }
    
    pub fn gen_proof(&self, symbol: &str) -> Option<Proof<[u8; 32]>> {
        let index = self.data.keys().position(|s| s == symbol)?;
        Some(self.tree.gen_proof(index))
    }
    
    pub fn root(&self) -> [u8; 32] {
        self.tree.root()
    }
    
    pub fn get(&self, symbol: &str) -> Option<&AssetData> {
        self.data.get(symbol)
    }
    
    pub fn verify_proof(&self, asset_data: &AssetData, proof: &Proof<[u8; 32]>) -> bool {
        let leaf = self.compute_hash(asset_data);
        let root = self.tree.root();
        verify_proof(&root, &leaf, proof)
    }
}

fn example_usage() {
    let mut store = AssetDataStore::new();
    
    let asset_data = AssetData {
        symbol: "BTC/USD".to_string(),
        price: 50000.0,
        timestamp: 1626854678,
    };
    
    store.regenerate(vec![asset_data]);
    
    // Get the asset data
    let asset_data = store.get("BTC/USD").unwrap();
    println!("{:?}", asset_data);
    
    // Update the asset data
    let updated_data = AssetData {
        symbol: "ETH/USD".to_string(),
        price: 1700.0,
        timestamp: 1626855678,
    };
    store.regenerate(vec![*asset_data, updated_data]).unwrap();
    
    // Get the updated asset data
    let updated_data = store.get("BTC/USD").unwrap();
    println!("{:?}", updated_data);
    
    let proof = store.gen_proof("BTC/USD").unwrap();
    let root = store.root();
    
    // Verify the proof
    assert!(store.verify_proof(asset_data, &proof));
}
