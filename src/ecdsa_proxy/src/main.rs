use ic_cdk::api::call::{CallResult, RejectionCode};
use ic_cdk_macros::{update};
use ic_cdk::export::{
    serde::{Deserialize, Serialize},
    candid::CandidType,
    Principal,
};
use ic_cdk::api::management_canister::ecdsa::{
    SignWithEcdsaArgument,
    SignWithEcdsaResponse,
    EcdsaPublicKeyArgument,
    EcdsaPublicKeyResponse,
};
use canistergeek_ic_rust::monitor::{collect_metrics};

#[update]
pub async fn ecdsa_public_key(arg: EcdsaPublicKeyArgument) -> EcdsaPublicKeyResponse {
    ic_cdk::api::print("proxy: ecdsa_public_key called");
    
    let (res,): (EcdsaPublicKeyResponse,) = ic_cdk::call(Principal::management_canister(), "ecdsa_public_key", (arg,))
        .await
        .map_err(|e| format!("Proxy: failed to call ecdsa_public_key {}", e.1)).unwrap();
    
    collect_metrics();
    
    res
}

#[update]
pub async fn sign_with_ecdsa(arg: SignWithEcdsaArgument, ecdsa_sign_cycles: u64) -> SignWithEcdsaResponse {
    ic_cdk::api::print("proxy: sign_with_ecdsa called");
    
    let (res,): (SignWithEcdsaResponse,) = ic_cdk::api::call::call_with_payment(Principal::management_canister(), "sign_with_ecdsa", (arg,), ecdsa_sign_cycles)
        .await
        .map_err(|e| format!("Proxy: failed to call sign_with_ecdsa {}", e.1)).unwrap();
    
    collect_metrics();
    
    res
}

fn main() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
