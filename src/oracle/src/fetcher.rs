use std::time::Duration;
use ic_cdk::export::{
    candid::CandidType,
    serde::{Deserialize, Serialize},
    Principal,
};
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
use futures::future::join_all;

use crate::http::send_request;
use crate::processing::average;
use crate::pubsub::notify;
use crate::*;

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Endpoint {
    pub url: String,
    pub resolver: String,
}

#[derive(Clone, Debug, Default)]
pub struct Fetcher {
    pub frequency: u64,
    pub endpoints: Vec<Endpoint>,
    pub timer_id: TimerId,
}

impl Fetcher {
    pub fn new(endpoints: Vec<Endpoint>, frequency: u64) -> Self {
        let endpoints_cloned = endpoints.clone();

        let func = move || ic_cdk::spawn(
            Fetcher::fetch(
                endpoints_cloned.clone()
            )
        );

        func();

        let timer_id = set_timer_interval(
            Duration::from_secs(frequency),
            func,
        );

        let fetcher = Fetcher {
            frequency,
            endpoints,
            timer_id,
        };

        fetcher
    }

    pub fn stop(self) {
        clear_timer(self.timer_id);
    }

    async fn fetch(endpoints: Vec<Endpoint>) {
        // fetch data from endpoints

        let outputs = endpoints.iter().map(|endpoint| {
            let url = endpoint.url.clone();
            let resolver = endpoint.resolver.clone();

            async move {
                match send_request(url, HttpMethod::GET, None).await {
                    Ok(body) => {
                        let body: Value = serde_json::from_str(&body).unwrap();

                        // todo: check expected behavior of resolver on more complex responses
                        // todo: handle different types of responses
                        Ok(body[resolver].as_str().expect("Parse Value to String").parse::<f64>().expect("Convert to float"))
                    },
                    Err(err) => {
                        Err(err)
                    }
                }
            }
        }).collect::<Vec<_>>();

        let outputs = join_all(outputs).await;

        outputs.iter().for_each(|output| {
            match output {
                Ok(output) => {
                    ic_cdk::api::print(format!("Output: {}", output));
                },
                Err(err) => {
                    ic_cdk::api::print(format!("Error: {:?}", err));
                }
            }
        });

        // processing it
        // todo: handle other processing methods (which could be defined on creating oracle stage)
        let result = average(outputs);

        ic_cdk::api::print(format!("Result: {}", result));

        // call publisher to publish it to all subscribers
        notify(result).await;

        return;
    }
}
