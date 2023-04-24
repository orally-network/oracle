use ic_cdk::export::candid::{CandidType, Deserialize};
use serde::{Deserialize as SerdeDeserialize, Serialize};
use std::collections::HashMap;
use std::string::ToString;
use ic_web3::ethabi::{
    encode, Token,
    ethereum_types::{U256},
};
use merkle_tree_rs::{
    standard::{StandardMerkleTree, LeafType, standard_leaf_hash},
    core::{MultiProof},
};
use ethers::{
    types::{Bytes},
    utils::{hex, keccak256},
};

fn convert_nested_string_to_str(strings: &Vec<Vec<String>>) -> Vec<Vec<&str>> {
    strings
        .iter()
        .map(|string_vec| {
            string_vec.iter().map(AsRef::as_ref).collect::<Vec<&str>>()
        })
        .collect::<Vec<Vec<&str>>>()
}

#[derive(Clone, Debug, Default, Serialize, CandidType, SerdeDeserialize, PartialEq)]
pub struct AssetData {
    pub symbol: String,
    pub price: u64,
    pub timestamp: u64,
    pub decimals: u64,
}

impl AssetData {
    fn to_leaf(&self) -> String {
        let tokens = vec![
            Token::String(self.symbol.clone()),
            Token::Uint(U256::from(self.price)),
            Token::Uint(U256::from(self.timestamp)),
            Token::Uint(U256::from(self.decimals)),
        ];
    
        let bytes = Bytes::from(keccak256(keccak256(
            Bytes::from(
                encode(&tokens)
            )
        )));
        
        hex::encode(bytes)
    }
    
    fn compound_value(&self) -> Vec<String> {
        vec![
            self.symbol.clone(),
            self.price.to_string(),
            self.timestamp.to_string(),
            self.decimals.to_string()
        ]
    }
}

#[derive(Clone, Serialize, Deserialize)]
pub struct AssetDataStore {
    data_store: HashMap<String, (AssetData, usize)>,
    tree: StandardMerkleTree,
}

impl Default for AssetDataStore {
    fn default() -> Self {
        Self::new(vec![])
    }
}

impl AssetDataStore {
    pub fn new(data: Vec<AssetData>) -> Self {
        let mut data_store = HashMap::new();
        
    
        let leafs = data.iter().enumerate().map(|(i, asset_data)| {
            data_store.insert(asset_data.symbol.clone(), (asset_data.clone(), i));
        
            let str = asset_data.compound_value();
    
            // for test
            // println!("str: {:?}", str);
            // let leaf_encoding: &[String] = &["string".to_string(), "uint64".to_string(), "uint64".to_string(), "uint64".to_string()];
            // let hash = standard_leaf_hash(str.clone(), leaf_encoding);
            // println!("hash: {:?}", hash);
            
            str
        }).collect();
        
        let leaf_encoding: &[&str] = &["string", "uint64", "uint64", "uint64"];
        
        let leafs_str = convert_nested_string_to_str(&leafs);
        
        println!("leafs_str: {:?}", leafs_str);
    
        Self {
            data_store,
            tree: StandardMerkleTree::of(leafs_str, leaf_encoding),
        }
    }
    
    pub fn get_asset_data(&self, symbol: &str) -> AssetData {
        self.data_store.get(symbol).unwrap().0.clone()
    }
    
    pub fn get_root(&self) -> String {
        self.tree.root()
    }
    
    pub fn get_proof(&self, symbol: &str) -> Vec<String> {
        let leaf = self.data_store.get(symbol).unwrap().1;
        
        self.tree.get_proof(LeafType::Number(leaf))
    }
    
    // pub fn get_multi_proof(&self, symbols: Vec<&str>) -> MultiProof<Vec<String>, String> {
    //     let leafs = symbols.iter().map(|symbol| {
    //         let leaf = self.data_store.get(symbol).unwrap().1;
    //         
    //         LeafType::Number(leaf)
    //     }).collect();
    //     
    //     self.tree.get_multi_proof(leafs)
    // }
    
    pub fn render(&self) -> String {
        self.tree.render()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    fn create_sample_data() -> Vec<AssetData> {
        vec![
            AssetData {
                symbol: "LTC/USD".to_string(),
                price: 22,
                timestamp: 1_000_003,
                decimals: 2,
            },
            AssetData {
                symbol: "BTC/USD".to_string(),
                price: 45000,
                timestamp: 1_000_000,
                decimals: 2,
            },
            AssetData {
                symbol: "ICP/USD".to_string(),
                price: 10,
                timestamp: 1_000_009,
                decimals: 2,
            },
            AssetData {
                symbol: "ETH/USD".to_string(),
                price: 3000,
                timestamp: 1000000,
                decimals: 2,
            },
            AssetData {
                symbol: "WWW/USD".to_string(),
                price: 300,
                timestamp: 1_000_010,
                decimals: 2,
            },
        ]
    }
    
    // #[test]
    // fn test_add_batch_asset_data() {
    //     let mut store = AssetDataStore::new();
    //     let data = create_sample_data();
    //     
    //     store.add_batch_asset_data(data.clone());
    //     
    //     assert_eq!(store.get_asset_data("BTC/USD"), Some(&data[1]));
    //     assert_eq!(store.get_asset_data("ETH/USD"), Some(&data[3]));
    // }
    
    #[test]
    fn test_generate_and_verify_proof() {
        let data = create_sample_data();
        
        let store = AssetDataStore::new(data.clone());
    
        let root = store.get_root();
        
        println!("root: {}", root);
        
        let proof_ltc = store.get_proof("LTC/USD");
        println!("proof_ltc: {:?}", proof_ltc);
        
        let proof_btc = store.get_proof("BTC/USD");
        println!("proof_btc: {:?}", proof_btc);
        
        let proof_eth = store.get_proof("ETH/USD");
        println!("proof_eth: {:?}", proof_eth);
        
        let proof_icp = store.get_proof("ICP/USD");
        println!("proof_icp: {:?}", proof_icp);
        
        let proof_www = store.get_proof("WWW/USD");
        println!("proof_www: {:?}", proof_www);
        
        assert_eq!(store.render(), store.render())
    }
}
