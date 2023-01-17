use ic_cdk::api::management_canister::main::{create_canister_with_extra_cycles, CanisterIdRecord};
use ic_cdk_macros::{update};

const INIT_CYCLES_BALANCE: u128 = 1_000_000_000_000_000;

#[update]
fn create_oracle() -> CanisterIdRecord {
    // create_canister_with_extra_cycles(_, cycles)
}

fn main() {}
