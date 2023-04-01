use tiny_keccak::{Hasher, Keccak};

pub struct MerkleTree {
    data: Vec<Vec<u8>>,
}

impl MerkleTree {
    pub fn new(data: &[Vec<u8>]) -> Self {
        let mut tree = MerkleTree { data: vec![] };
        tree.build(data);
        tree
    }
    
    fn build(&mut self, data: &[Vec<u8>]) {
        let mut current_level = data.to_vec();
        while current_level.len() > 1 {
            let mut next_level = vec![];
            
            for i in (0..current_level.len()).step_by(2) {
                let left = &current_level[i];
                let right = if i + 1 < current_level.len() {
                    &current_level[i + 1]
                } else {
                    &current_level[i]
                };
                
                let mut hasher = Keccak::v256();
                hasher.update(left);
                hasher.update(right);
                let mut hash = [0u8; 32];
                hasher.finalize(&mut hash);
                
                next_level.push(hash.to_vec());
            }
            
            current_level = next_level;
        }
        
        self.data = current_level;
    }
    
    pub fn root(&self) -> Option<Vec<u8>> {
        self.data.first().cloned()
    }
    
    pub fn gen_proof(&self, index: usize) -> Vec<Vec<u8>> {
        let mut path = vec![];
        
        let mut current_level: &[Vec<u8>] = &self.data;
        let mut current_index = index;
        
        while current_level.len() > 1 {
            let sibling_index = if current_index % 2 == 0 {
                current_index + 1
            } else {
                current_index - 1
            };
            
            if sibling_index < current_level.len() {
                path.push(current_level[sibling_index].clone());
            }
            
            current_index /= 2;
            current_level = &current_level[current_index..];
        }
        
        path
    }
    
    pub fn verify_proof(
        &self,
        data_hash: &[u8],
        proof: &[Vec<u8>],
        expected_root: &[u8],
    ) -> bool {
        let mut computed_hash = data_hash.to_vec();
        
        for sibling in proof {
            let mut hasher = Keccak::v256();
            if computed_hash < *sibling {
                hasher.update(&computed_hash);
                hasher.update(sibling);
            } else {
                hasher.update(sibling);
                hasher.update(&computed_hash);
            }
            
            computed_hash.resize(32, 0);
            hasher.finalize(&mut computed_hash);
        }
        
        computed_hash.as_slice() == expected_root
    }
}
