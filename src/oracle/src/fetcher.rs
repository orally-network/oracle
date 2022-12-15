use std::time::Duration;
use serde::{Deserialize, Serialize};
use serde_json::{self, Value};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse, TransformArgs,
    TransformContext,
};
use ic_cdk::{
    query,
    timer::{clear_timer, set_timer, set_timer_interval, TimerId},
    update,
};
use ic_cdk::api::call::RejectionCode;
use ic_web3::futures::TryFutureExt;

use crate::http::send_request;

use crate::*;

#[derive(Clone, Debug, Default)]
pub struct Endpoint {
    pub url: String,
    pub resolver: String,
}

#[derive(Clone, Debug, Default)]
pub struct Fetcher {
    pub frequency: u64,
    pub endpoints: Option<Vec<Endpoint>>,
}


impl Fetcher {
    pub async fn new(endpoints: Option<Vec<Endpoint>>, frequency: u64) -> Self {
        let fetcher = Fetcher {
            frequency,
            endpoints,
        };

        set_timer_interval(
            Duration::from_secs(frequency),
            || ic_cdk::spawn(Fetcher::fetch())
        );

        fetcher
    }

    async fn fetch() {
        // fetch data from endpoints

        // processing it

        // store it in the state

        // call publisher to publish it
        ic_cdk::api::print("aaa");

        let host = "api.pro.coinbase.com".to_string();

        let url = format!("https://{host}/products/ICP-USD/stats");
        ic_cdk::api::print(url.clone());

        match send_request(url, HttpMethod::GET, None).await {
            Ok(response) => {
                ic_cdk::api::print(format!("Response from fetch_price: {}", response));

                let response_obj: Value = serde_json::from_str(&response).unwrap();

                ic_cdk::api::print(format!("Price: {}", response_obj["last"]));

                // Ok(response_obj["last"].to_string());
            }
            Err((code, message)) => {
                let f_message =
                    format!("The http_request resulted into error. RejectionCode: {code:?}, Error: {message}");
                ic_cdk::api::print(f_message.clone());

                // Err(message);
            }
        };
    }
}
