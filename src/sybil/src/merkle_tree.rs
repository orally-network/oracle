use crypto::digest::Digest;
use crypto::sha2::Sha256;
use std::collections::HashMap;

#[derive(Clone, Debug)]
struct Node {
    hash: Vec<u8>,
}

impl Node {
    fn new(data: &[u8]) -> Node {
        let mut hasher = Sha256::new();
        hasher.input(data);
        let mut hash = vec![0; hasher.output_bytes()];
        hasher.result(&mut hash);
        
        Node { hash }
    }
    
    fn combine(a: &Node, b: &Node) -> Node {
        let mut hasher = Sha256::new();
        hasher.input(&a.hash);
        hasher.input(&b.hash);
        let mut hash = vec![0; hasher.output_bytes()];
        hasher.result(&mut hash);
        
        Node { hash }
    }
}

pub struct MerkleTree {
    leaves: HashMap<Vec<u8>, Node>,
    root: Option<Node>,
}

impl MerkleTree {
    pub fn new() -> MerkleTree {
        MerkleTree {
            leaves: HashMap::new(),
            root: None,
        }
    }
    
    pub fn add_leaf(&mut self, data: &[u8]) {
        let node = Node::new(data);
        self.leaves.insert(data.to_vec(), node);
    }
    
    pub fn compute_root(&mut self) -> Result<(), &'static str> {
        if self.leaves.is_empty() {
            return Err("No leaves in the Merkle Tree");
        }
        
        let mut nodes = self.leaves.values().cloned().collect::<Vec<Node>>();
        
        while nodes.len() > 1 {
            let mut next_level = Vec::new();
            
            for pair in nodes.chunks(2) {
                match pair {
                    &[ref a, ref b] => next_level.push(Node::combine(a, b)),
                    &[ref a] => next_level.push(a.clone()),
                    _ => unreachable!(),
                }
            }
            
            nodes = next_level;
        }
        
        self.root = Some(nodes[0].clone());
        Ok(())
    }
    
    pub fn generate_proof(&self, data: &[u8]) -> Result<Vec<u8>, &'static str> {
        let mut path = Vec::new();
        let mut current = match self.leaves.get(data) {
            Some(node) => node.clone(),
            None => return Err("Data not found in the Merkle Tree"),
        };
        
        let mut nodes = self.leaves.values().cloned().collect::<Vec<Node>>();
        
        while nodes.len() > 1 {
            let mut next_level = Vec::new();
            let mut i = 0;
            
            while i < nodes.len() {
                let a = &nodes[i];
                let b = if i + 1 < nodes.len() {
                    &nodes[i + 1]
                } else {
                    a
                };
                
                if *a == current || *b == current {
                    path.extend_from_slice(&a.hash);
                    path.extend_from_slice(&b.hash);
                    current = Node::combine(a, b);
                }
                
                next_level.push(Node::combine(a, b));
                i += 2;
            }
            
            nodes = next_level;
        }
        
        Ok(path)
    }
    
    pub fn get_root(&self) -> Option<Vec<u8>> {
        self.root.as_ref().map(|node| node.hash.clone())
    }
}