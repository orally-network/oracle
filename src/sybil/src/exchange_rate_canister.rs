use ic_cdk::export::{
    candid::{CandidType, Deserialize},
};
use ic_cdk::api::call::CallResult;
use ic_cdk::api::call::{call_with_payment};

use crate::*;

pub const CYCLES_TO_SEND: u64 = 10_000_000_000;

#[derive(CandidType, Deserialize)]
pub enum AssetClass { Cryptocurrency, FiatCurrency }

#[derive(CandidType, Deserialize)]
pub struct Asset { pub(crate) class: AssetClass, pub(crate) symbol: String }

#[derive(CandidType, Deserialize)]
pub struct GetExchangeRateRequest {
    pub(crate) timestamp: Option<u64>,
    pub(crate) quote_asset: Asset,
    pub(crate) base_asset: Asset,
}

#[derive(CandidType, Deserialize)]
pub struct ExchangeRateMetadata {
    decimals: u32,
    forex_timestamp: Option<u64>,
    quote_asset_num_received_rates: u64,
    base_asset_num_received_rates: u64,
    base_asset_num_queried_sources: u64,
    standard_deviation: u64,
    quote_asset_num_queried_sources: u64,
}

#[derive(CandidType, Deserialize)]
pub struct ExchangeRate {
    metadata: ExchangeRateMetadata,
    pub(crate) rate: u64,
    timestamp: u64,
    quote_asset: Asset,
    base_asset: Asset,
}

#[derive(CandidType, Deserialize)]
pub enum ExchangeRateError {
    AnonymousPrincipalNotAllowed,
    CryptoQuoteAssetNotFound,
    FailedToAcceptCycles,
    ForexBaseAssetNotFound,
    CryptoBaseAssetNotFound,
    StablecoinRateTooFewRates,
    ForexAssetsNotFound,
    InconsistentRatesReceived,
    RateLimited,
    StablecoinRateZeroRate,
    Other{ code: u32, description: String },
    ForexInvalidTimestamp,
    NotEnoughCycles,
    ForexQuoteAssetNotFound,
    StablecoinRateNotFound,
    Pending,
}

#[derive(CandidType, Deserialize)]
pub enum GetExchangeRateResult { Ok(ExchangeRate), Err(ExchangeRateError) }

pub struct SERVICE(pub Principal);

impl SERVICE{
    pub async fn get_exchange_rate(
        &self,
        arg0: GetExchangeRateRequest,
    ) -> CallResult<(GetExchangeRateResult,)> {
        call_with_payment(self.0, "get_exchange_rate", (arg0,), CYCLES_TO_SEND).await
    }
}
