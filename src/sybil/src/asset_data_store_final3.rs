use std::fmt;
use std::hash::Hasher;
use std::iter::FromIterator;
// use crypto::sha3::{Sha3, Sha3Mode};
// use crypto::digest::Digest;
use sha3::{Digest, Keccak256};
use merkle_light::merkle::{MerkleTree};
use merkle_light::hash::{Algorithm, Hashable};

pub struct ExampleAlgorithm(Keccak256);

impl ExampleAlgorithm {
    pub fn new() -> ExampleAlgorithm {
        ExampleAlgorithm(Keccak256::new())
    }
}

impl Default for ExampleAlgorithm {
    fn default() -> ExampleAlgorithm {
        ExampleAlgorithm::new()
    }
}

impl Hasher for ExampleAlgorithm {
    #[inline]
    fn write(&mut self, msg: &[u8]) {
        self.0.update(msg)
    }
    
    #[inline]
    fn finish(&self) -> u64 {
        unimplemented!()
    }
}

impl Algorithm<[u8; 32]> for ExampleAlgorithm {
    #[inline]
    fn hash(&mut self) -> [u8; 32] {
        let mut h = [0u8; 32];
        h.copy_from_slice(self.0.clone().finalize().as_slice());
        h
    }
    
    #[inline]
    fn reset(&mut self) {
        self.0.reset();
    }
}

fn main() {
    let mut h1 = [0u8; 32];
    let mut h2 = [0u8; 32];
    let mut h3 = [0u8; 32];
    h1[0] = 0x11;
    h2[0] = 0x22;
    h3[0] = 0x33;
    
    let t: MerkleTree<[u8; 32], ExampleAlgorithm> = MerkleTree::from_iter(vec![h1, h2, h3]);
    println!("{:?}", t.root());
}

#[cfg(test)]
mod tests {
    use super::*;
    use merkle_light::merkle::MerkleTree;
    
    #[test]
    fn test_merkle_tree() {
        let mut h1 = [0u8; 32];
        let mut h2 = [0u8; 32];
        let mut h3 = [0u8; 32];
        h1[0] = 0x11;
        h2[0] = 0x22;
        h3[0] = 0x33;
        
        let t: MerkleTree<[u8; 32], ExampleAlgorithm> = MerkleTree::from_iter(vec![h1, h2, h3]);
        assert_eq!(t.root(), [185, 8, 109, 48, 20, 107, 131, 141, 147, 216, 142, 31, 167, 111, 179, 70, 118, 79, 170, 191, 111, 101, 74, 106, 168, 219, 67, 186, 200, 5, 47, 59]);
    }
}