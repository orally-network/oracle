use ic_cdk_macros::{query, update};
use ic_cdk::export::{Principal};
use crate::*;

#[query(name = "getCanistergeekInformation")]
pub async fn get_canistergeek_information(request: canistergeek_ic_rust::api_type::GetInformationRequest) -> canistergeek_ic_rust::api_type::GetInformationResponse<'static> {
    validate_caller();
    canistergeek_ic_rust::get_information(request)
}

#[update(name = "updateCanistergeekInformation")]
pub async fn update_canistergeek_information(request: canistergeek_ic_rust::api_type::UpdateInformationRequest) -> () {
    validate_caller();
    canistergeek_ic_rust::update_information(request);
}

fn validate_caller() -> () {
    log_message(format!("Caller: {:?}", ic_cdk::caller()));

    // match Principal::from_text("hozae-racaq-aaaaa-aaaaa-c") {
    //     Ok(caller) if caller == ic_cdk::caller() => (),
    //     _ => ic_cdk::trap("Invalid caller")
    // }
}
