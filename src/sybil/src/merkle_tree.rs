use sha3::{Digest, Keccak256};
use std::iter::once;

#[derive(Default)]
pub struct MerkleTree {
    pub root: Vec<u8>,
    pub nodes: Vec<Vec<u8>>,
    pub levels: Vec<Vec<Vec<u8>>>,
}

impl MerkleTree {
    pub fn new(leaves: &[Vec<u8>]) -> Self {
        let mut nodes = leaves
            .iter()
            .map(|leaf| {
                let mut hasher = Keccak256::new();
                hasher.update(leaf);
                hasher.finalize().to_vec()
            })
            .collect::<Vec<Vec<u8>>>();
        
        let mut levels = vec![nodes.clone()];
        
        while nodes.len() > 1 {
            nodes = nodes
                .chunks(2)
                .map(|pair| match pair {
                    [a, b] => hash_pair(a, b),
                    [a] => hash_pair(a, a),
                    _ => unreachable!(),
                })
                .collect();
            levels.push(nodes.clone());
        }
        
        let root = nodes[0].clone();
        MerkleTree { root, nodes: levels[0].clone(), levels }
    }
    
    pub fn hash(data: Vec<u8>) -> Vec<u8> {
        let mut hasher = Keccak256::new();
        hasher.update(data);
        hasher.finalize().to_vec()
    }
    
    pub fn verify_proof(&self, proof: &[Vec<u8>], root: &[u8], leaf: Vec<u8>) -> bool {
        let leaf_hash = MerkleTree::hash(leaf);
        
        let mut computed_hash = leaf_hash.clone();
        
        for sibling in proof {
            computed_hash = if computed_hash < *sibling {
                hash_pair(&computed_hash, sibling)
            } else {
                hash_pair(sibling, &computed_hash)
            };
        }
        
        computed_hash.as_slice() == root
    }
    
    
    pub fn generate_proof(&self, leaf: Vec<u8>) -> Option<Vec<Vec<u8>>> {
        let leaf_hash = MerkleTree::hash(leaf);
        let leaf_position = self.nodes.iter().position(|n| n == &leaf_hash)?;
        
        let mut proof = vec![];
        let mut current_position = leaf_position;
        
        for level in self.levels.iter().skip(1) {
            let sibling_position = if current_position % 2 == 0 {
                current_position + 1
            } else {
                current_position - 1
            };
            
            if let Some(sibling) = level.get(sibling_position) {
                proof.push(sibling.clone());
            }
            
            current_position /= 2;
        }
        
        Some(proof)
    }
}

fn hash_pair(a: &[u8], b: &[u8]) -> Vec<u8> {
    let mut hasher = Keccak256::new();
    hasher.update(a);
    hasher.update(b);
    hasher.finalize().to_vec()
}

fn main() {
    let leaves = vec![
        b"element1".to_vec(),
        b"element2".to_vec(),
        b"element3".to_vec(),
        b"element4".to_vec(),
    ];
    
    let tree = MerkleTree::new(&leaves);
    
    let proof = tree.generate_proof(leaves[0].clone()).unwrap();
    let is_valid = tree.verify_proof(&proof, &tree.root, leaves[0].clone());
    
    println!("Generated proof: {:?}", proof);
    println!("Proof is valid: {}", is_valid);
}