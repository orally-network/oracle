
// todo: multi params in the future
pub struct Subscription {
    pub chain_id: String,
    pub rpc_url: String,
    pub method: String,
    pub abi: Vec<u8>,
}
