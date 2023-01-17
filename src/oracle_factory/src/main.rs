use ic_cdk::export::{
    serde::{Deserialize, Serialize},
    candid::{CandidType, encode_one},
};
use ic_cdk::api::call::{call};
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
use ic_cdk_macros::{update};

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Endpoint {
    pub url: String,
    pub resolver: String,
}

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
struct InitPayload {
    endpoints: Vec<Endpoint>,
    frequency: u64,
    chain_id: u64,
    rpc: String,
}

const INIT_CYCLES_BALANCE: u128 = 1_000_000_000_000; // 1T

#[update]
async fn create_oracle(payload: InitPayload) -> Result<String, String> {
    ic_cdk::println!("Creating oracle canister, payload: {:?}", payload);

    let canister_id = match create_canister_with_extra_cycles(CreateCanisterArgument { settings: None }, INIT_CYCLES_BALANCE.into()).await {
        Ok((CanisterIdRecord { canister_id },)) => canister_id,
        Err(error) => {
            ic_cdk::trap(&format!("Failed to create canister: {}", error.1));
        }
    };

    ic_cdk::println!("Created oracle canister: {:?}", canister_id.to_string());

    let wasm = include_bytes!("./build/oracle.wasm.gz");

    match install_code(InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id: canister_id.clone(),
        wasm_module: wasm.to_vec(),
        arg: encode_one(&payload).unwrap(),
    }).await {
        Ok(()) => {
            ic_cdk::println!("Installed oracle canister: {:?}", canister_id.to_string());

            match call(canister_id.clone(), "start", ()).await {
                Ok(()) => {
                    ic_cdk::println!("Started oracle canister: {:?}", canister_id.to_string());
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

fn main() {
    candid::export_service!();
    std::print!("{}", __export_service());
}
