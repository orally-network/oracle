use ic_cdk::export::{
    serde::{Deserialize, Serialize},
    candid::{CandidType, encode_one, Principal},
};
use ic_cdk::api::{
    call::{call},

};
use ic_cdk::api::management_canister::main::{
    create_canister_with_extra_cycles,
    CanisterIdRecord,
    CREATE_CANISTER_CYCLES,
    CreateCanisterArgument,
    CanisterSettings,
    CanisterId,
    CanisterInstallMode,
    install_code,
    InstallCodeArgument,
};
use canistergeek_ic_rust::{
    logger::{log_message},
    monitor::{collect_metrics},
};
use ic_cdk_macros::{query, update};
use std::cell::{Cell, RefCell};

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Endpoint {
    pub url: String,
    pub resolver: String,
}

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct InitPayload {
    endpoints: Vec<Endpoint>,
    frequency: u64,
    chain_id: u64,
    rpc: String,
}

const INIT_CYCLES_BALANCE: u128 = 1_000_000_000_000; // 1T

thread_local! {
    pub static ORACLE_IDS: RefCell<Vec<String>> = RefCell::default();
}

#[update]
async fn create_oracle(payload: InitPayload) -> Result<String, String> {
    ic_cdk::println!("Creating oracle canister, payload: {:?}", payload);
    log_message(format!("Creating oracle canister, payload: {:?}", payload));

    let canister_id = match create_canister_with_extra_cycles(CreateCanisterArgument { settings: None }, INIT_CYCLES_BALANCE.into()).await {
        Ok((CanisterIdRecord { canister_id },)) => canister_id,
        Err(error) => {
            ic_cdk::trap(&format!("Failed to create canister: {}", error.1));
        }
    };

    ic_cdk::println!("Created oracle canister: {:?}", canister_id.to_string());
    log_message(format!("Created oracle canister: {:?}", canister_id.to_string()));

    let wasm = include_bytes!("./build/oracle.wasm.gz");

    match install_code(InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: canister_id.clone(),
        wasm_module: wasm.to_vec(),
        arg: encode_one(&payload).unwrap(),
    }).await {
        Ok(()) => {
            ic_cdk::println!("Installed oracle canister: {:?}", canister_id.to_string());
            log_message(format!("Installed oracle canister: {:?}", canister_id.to_string()));

            match call(canister_id.clone(), "start", ()).await {
                Ok(()) => {
                    collect_metrics();
                    ic_cdk::println!("Started oracle canister: {:?}", canister_id.to_string());
                    log_message(format!("Started oracle canister: {:?}", canister_id.to_string()));

                    ORACLE_IDS.with(|ids| {
                        ids.borrow_mut().push(canister_id.to_string());
                    });

                    Ok(canister_id.to_string())
                },
                Err(error) => {
                    ic_cdk::trap(&format!("Failed to start canister: {}", error.1));
                }
            }
        },
        Err(error) => {
            ic_cdk::trap(&format!("Failed to install code: {}", error.1));
        }
    }
}

#[update]
async fn update_oracle(canister: String) -> Result<String, String> {
    let canister_id = Principal::from_text(&canister).unwrap();

    ic_cdk::println!("Updating oracle canister, canister_id: {:?}", canister_id.to_string());
    log_message(format!("Updating oracle canister, canister_id: {:?}", canister_id.to_string()));

    let wasm = include_bytes!("./build/oracle.wasm.gz");

    match install_code(InstallCodeArgument {
        mode: CanisterInstallMode::Upgrade,
        canister_id: canister_id.clone(),
        wasm_module: wasm.to_vec(),
        arg: vec![],
    }).await {
        Ok(()) => {
            ic_cdk::println!("Updated oracle canister: {:?}", canister_id.to_string());
            log_message(format!("Updated oracle canister: {:?}", canister_id.to_string()));

            match call(canister_id.clone(), "start", ()).await {
                Ok(()) => {
                    collect_metrics();
                    ic_cdk::println!("Started oracle canister: {:?}", canister_id.to_string());
                    log_message(format!("Started oracle canister: {:?}", canister_id.to_string()));

                    Ok(canister_id.to_string())
                },
                Err(error) => {
                    ic_cdk::trap(&format!("Failed to start canister: {}", error.1));
                }
            }
        },
        Err(error) => {
            ic_cdk::trap(&format!("Failed to install code: {}", error.1));
        }
    }
}

#[update]
async fn update_oracles() -> Result<String, String> {
    ic_cdk::println!("Updating all oracle canisters");
    log_message(format!("Updating all oracle canisters"));

    let ids = ORACLE_IDS.with(|o| o.borrow().clone());

    for id in ids {
        match update_oracle(id.clone()).await {
            Ok(_) => {
                ic_cdk::println!("Updated oracle canister: {:?}", id);
                log_message(format!("Updated oracle canister: {:?}", id));
            },
            Err(error) => {
                ic_cdk::trap(&format!("Failed to update canister: {}", error));
            }
        }
    }

    Ok("Updated all oracle canisters".to_string())
}

#[query]
fn get_oracles() -> Vec<String> {
    ORACLE_IDS.with(|o| o.borrow().clone())
}

#[ic_cdk_macros::pre_upgrade]
fn pre_upgrade_function() {
    ic_cdk::println!("Pre upgrade function");
    log_message(format!("Pre upgrade function"));

    let ids = ORACLE_IDS.with(|o| o.take());
    let monitor_stable_data = canistergeek_ic_rust::monitor::pre_upgrade_stable_data();
    let logger_stable_data = canistergeek_ic_rust::logger::pre_upgrade_stable_data();

    ic_cdk::storage::stable_save((ids, monitor_stable_data, logger_stable_data)).expect("Failed to save stable data");
}

#[ic_cdk_macros::post_upgrade]
fn post_upgrade_function() {
    ic_cdk::println!("Post upgrade function");
    log_message(format!("Post upgrade function"));

    let stable_data: Result<(Vec<String>, canistergeek_ic_rust::monitor::PostUpgradeStableData, canistergeek_ic_rust::logger::PostUpgradeStableData), String> = ic_cdk::storage::stable_restore();

    match stable_data {
        Ok((ids, monitor_stable_data, logger_stable_data)) => {
            ORACLE_IDS.with(|o| o.replace(ids));
            canistergeek_ic_rust::monitor::post_upgrade_stable_data(monitor_stable_data);
            canistergeek_ic_rust::logger::post_upgrade_stable_data(logger_stable_data);
        }
        Err(_) => {}
    }
}

#[ic_cdk_macros::query(name = "getCanistergeekInformation")]
pub async fn get_canistergeek_information(request: canistergeek_ic_rust::api_type::GetInformationRequest) -> canistergeek_ic_rust::api_type::GetInformationResponse<'static> {
    validate_caller();
    canistergeek_ic_rust::get_information(request)
}

#[ic_cdk_macros::update(name = "updateCanistergeekInformation")]
pub async fn update_canistergeek_information(request: canistergeek_ic_rust::api_type::UpdateInformationRequest) -> () {
    validate_caller();
    canistergeek_ic_rust::update_information(request);
}

fn validate_caller() -> () {
    canistergeek_ic_rust::logger::log_message(format!("Caller: {:?}", ic_cdk::caller()));

    // match ic_cdk::export::Principal::from_text("hozae-racaq-aaaaa-aaaaa-c") {
    //     Ok(caller) if caller == ic_cdk::caller() => (),
    //     _ => ic_cdk::trap("Invalid caller")
    // }
}

fn main() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
