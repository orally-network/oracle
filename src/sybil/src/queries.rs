use crate::*;

#[query]
pub fn get_exchange_rate_canister_principal() -> String {
    EXCHANGE_RATE_CANISTER_PRINCIPAL.with(|principal| {
        principal.borrow().to_string()
    })
}
