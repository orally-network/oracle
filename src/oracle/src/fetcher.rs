use std::time::Duration;
use std::ops::Deref;
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
use canistergeek_ic_rust::{
    logger::{log_message},
    monitor::{collect_metrics},
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

#[derive(Clone, Debug, Default, CandidType, Serialize, Deserialize)]
pub struct Fetcher {
    pub frequency: u64,
    pub endpoints: Vec<Endpoint>,
}

impl Fetcher {
    pub fn new(endpoints: Vec<Endpoint>, frequency: u64) -> Self {
        if frequency < 60 {
            panic!("Frequency unset or need to be more than 1 minute.");
        }

        let fetcher = Fetcher {
            frequency,
            endpoints,
        };

        fetcher
    }

    pub fn start(self) {
        let func = move || ic_cdk::spawn(
            Fetcher::fetch(
                self.endpoints.clone(),
            )
        );

        func();

        let timer_id = set_timer_interval(
            Duration::from_secs(self.frequency),
            func,
        );

        TIMER_ID.with(|t| t.replace(timer_id));
    }

    pub fn stop(self) {
        let timer_id = TIMER_ID.with(|t| t.take());

        clear_timer(timer_id);
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
                    log_message(format!("Output: {}", output));
                },
                Err(err) => {
                    ic_cdk::api::print(format!("Error: {:?}", err));
                    log_message(format!("Error: {:?}", err));
                }
            }
        });

        // processing it
        // todo: handle other processing methods (which could be defined on creating oracle stage)
        let result = average(outputs);

        ic_cdk::api::print(format!("Result: {}", result));
        log_message(format!("Result: {}", result));

        // call publisher to publish it to all subscribers
        notify(result).await;

        collect_metrics();

        return;
    }
}
