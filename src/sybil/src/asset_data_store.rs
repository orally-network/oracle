use ic_cdk::export::{
    serde::{Deserialize, Serialize},
    candid::CandidType,
};
use eth_trie::{EthTrie, MemoryDB, Trie, TrieError};
// use primitive_types::H256;
use keccak_hash::{H256, keccak};
use rlp::{encode, Rlp, Encodable, RlpStream, Decodable, DecoderError};
use std::collections::HashMap;
use std::sync::Arc;
use bytes::BytesMut;
use std::fmt;


use crate::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssetData {
    symbol: String,
    price: f64,
    timestamp: u64,
}

impl Encodable for AssetData {
    fn rlp_append(&self, stream: &mut RlpStream) {
        // You can choose how to encode the fields of the struct
        stream.begin_list(3);
        stream.append(&self.symbol);
        stream.append(&self.price.to_be_bytes().to_vec());
        stream.append(&self.timestamp);
    }
}

impl Decodable for AssetData {
    fn decode(rlp: &Rlp) -> Result<Self, DecoderError> {
        if rlp.item_count()? != 3 {
            return Err(DecoderError::RlpIncorrectListLen);
        }
        
        let symbol: String = rlp.val_at(0)?;
        let price_bytes: Vec<u8> = rlp.val_at(1)?;
        let timestamp: u64 = rlp.val_at(2)?;
        
        let price = f64::from_be_bytes(<[u8; 8]>::try_from(price_bytes.as_slice()).map_err(|_| DecoderError::RlpInvalidLength)?);
        
        Ok(AssetData {
            symbol,
            price,
            timestamp,
        })
    }
}

// impl Decodable for AssetData {
//     fn decode(rlp: &Rlp) -> Result<Self, rlp::DecoderError> {
//         // You can choose how to decode the fields of the struct
//         Ok(AssetData {
//             symbol: rlp.val_at(0)?,
//             price: f64::from_be_bytes(rlp.val_at(1)?),
//             timestamp: rlp.val_at(2)?,
//         })
//     }
// }

impl AssetData {
    // fn to_key(&self) -> [u8; 32] {
    //     let mut data = [0u8; 32];
    //     data[..self.symbol.len()].copy_from_slice(self.symbol.as_bytes());
    //     
    //     // H256::from_slice(&data)
    //     data
    // }
    
    fn to_key(&self) -> [u8; 32] {
        let rlp_encoded = rlp::encode(self);
        let mut keccak = keccak::v256();
        let mut output = [0u8; 32];
        keccak.update(&rlp_encoded);
        keccak.finalize(&mut output);
        
        output
    }
    
    fn to_value(&self) -> BytesMut {
        let mut bytes = BytesMut::new();
        bytes.extend_from_slice(encode(self).as_ref());
        bytes
    }
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
    trie: EthTrie<MemoryDB>,
}

impl AssetDataStore {
    pub fn new() -> Self {
        let memdb = Arc::new(Default::default());
        let mut trie = EthTrie::new(memdb);
        
        AssetDataStore {
            data: HashMap::new(),
            trie,
        }
    }
    
    pub fn upsert(&mut self, asset_data: AssetData) {
        let key = asset_data.to_key();
        let value = asset_data.to_value();
        self.trie.insert(&key, &value).unwrap();
        self.data.insert(asset_data.symbol.clone(), asset_data);
    }
    
    pub fn get(&self, symbol: &str) -> Option<&AssetData> {
        self.data.get(symbol)
    }
    
    pub fn root(&mut self) -> H256 {
        self.trie.root_hash().unwrap()
    }
    
    pub fn generate_proof(&mut self, symbol: &str) -> Option<Vec<Vec<u8>>> {
        self.data.get(symbol).map(|asset_data| {
            let key = asset_data.to_key();
            let proof = self.trie.get_proof(&key).unwrap();
            proof
        })
    }
    
    // pub fn verify_proof(&mut self, asset_data: &AssetData, proof: Vec<Vec<u8>>) -> Result<bool, TrieError> {
    //     let key = asset_data.to_key();
    //     let value = asset_data.to_value();
    //     let root = self.root();
    //     
    //     self.trie.verify_proof(root, &key, proof)
    // }
    
    pub fn verify_proof(&mut self, asset_data: AssetData, proof: Vec<Vec<u8>>) -> Option<Vec<u8>> {
        let key = asset_data.to_key();
        let root: H256 = self.root();
        
        match self.trie.verify_proof(root, &key, proof) {
            Ok(value) => Some(value.unwrap()),
            Err(_) => None,
        }
    }
}

// #[update]
// pub fn asset_data_store_example_usage() -> bool {
//     let mut store = AssetDataStore::new();
//     
//     let asset_data = AssetData {
//         symbol: "BTC/USD".to_string(),
//         price: 50000.0,
//         timestamp: 1626854678,
//     };
//     
//     store.upsert(asset_data);
//     
//     let asset_data = store.get("BTC/USD").unwrap();
//     println!("{:?}", asset_data);
//     
//     let updated_data = AssetData {
//         symbol: "BTC/USD".to_string(),
//         price: 55000.0,
//         timestamp: 1626855678,
//     };
//     store.upsert(updated_data);
//     
//     let proof = store.generate_proof("BTC/USD").unwrap();
//     
//     // Verify the proof
//     let is_proof_valid = {
//         let updated_data = store.get("BTC/USD").unwrap();
//         
//         match store.verify_proof(updated_data.clone(), proof) {
//             Some(value) => {
//                 let rlp = Rlp::new(&value);
//                 let decoded_data = AssetData {
//                     symbol: rlp.val_at(0).unwrap(),
//                     price: f64::from_be_bytes(rlp.val_at(1).unwrap()),
//                     timestamp: rlp.val_at(2).unwrap(),
//                 };
//                 
//                 decoded_data == *updated_data
//             },
//             None => false,
//         }
//     };
//     
//     is_proof_valid
// }

#[cfg(test)]
mod tests {
    use super::*;
    use rlp::{decode, encode};
    
    #[test]
    fn asset_data_encoding_decoding() {
        let asset_data = AssetData {
            symbol: "BTC/USD".to_string(),
            price: 45000.0,
            timestamp: 1630000000,
        };
        
        let encoded = encode(&asset_data);
        let decoded: AssetData = decode(&encoded).unwrap();
        
        assert_eq!(asset_data.symbol, decoded.symbol);
        assert_eq!(asset_data.price, decoded.price);
        assert_eq!(asset_data.timestamp, decoded.timestamp);
    }
    
    #[test]
    fn asset_data_store_insert_and_get() {
        let mut store = AssetDataStore::new();
        let asset_data = AssetData {
            symbol: "BTC/USD".to_string(),
            price: 45000.0,
            timestamp: 1630000000,
        };
        
        store.upsert(asset_data.clone());
        let retrieved_data = store.get(&asset_data.symbol).unwrap();
        
        assert_eq!(asset_data.symbol, retrieved_data.symbol);
        assert_eq!(asset_data.price, retrieved_data.price);
        assert_eq!(asset_data.timestamp, retrieved_data.timestamp);
    }
    
    #[test]
    fn asset_data_store_proof_generation_and_verification() {
        let mut store = AssetDataStore::new();
        let asset_data = AssetData {
            symbol: "BTC/USD".to_string(),
            price: 45000.0,
            timestamp: 1630000000,
        };
        
        store.upsert(asset_data.clone());
    
        let asset_data_another = AssetData {
            symbol: "BTC/USD".to_string(),
            price: 451111.0,
            timestamp: 1630000000,
        };
        
        let proof = store.generate_proof(&asset_data_another.symbol).unwrap();
        let verified_value = store.verify_proof(asset_data_another.clone(), proof).unwrap();
        
        let decoded_asset_data: AssetData = decode(&verified_value).unwrap();
        
        // log everything
        println!("asset_data: {:?}", asset_data);
        println!("asset_data_another: {:?}", asset_data_another);
        println!("verified_value: {:?}", verified_value);
        println!("decoded_asset_data: {:?}", decoded_asset_data);
        
        assert_eq!(asset_data.symbol, decoded_asset_data.symbol);
        assert_eq!(asset_data.price, decoded_asset_data.price);
        assert_eq!(asset_data.timestamp, decoded_asset_data.timestamp);
    }
    
    #[test]
    fn test_invalid_proof() {
        let mut store = AssetDataStore::new();
        
        let asset_data = AssetData {
            symbol: "BTC/USD".to_string(),
            price: 50000.0,
            timestamp: 1629450100,
        };
        
        store.upsert(asset_data.clone());
        
        // let proof = vec![
        //     vec![1, 2, 3, 4],
        //     vec![5, 6, 7, 8],
        //     vec![9, 10, 11, 12],
        // ];
        let proof = store.generate_proof(&asset_data.symbol).unwrap();
    
    
        assert!(store.verify_proof(asset_data, proof).is_none());
    }
}
