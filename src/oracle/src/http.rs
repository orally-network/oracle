use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse, TransformArgs,
    TransformContext, TransformFunc,
};
use canistergeek_ic_rust::{
    logger::{log_message},
};
use ic_cdk::api::call::RejectionCode;

const MAX_RESPONSE_BYTES: u64 = 500_000;

pub async fn send_request(url: String, method: HttpMethod, body: Option<Vec<u8>>) -> Result<String, (RejectionCode, String)> {
    let request_headers = vec![
        HttpHeader {
            name: "User-Agent".to_string(),
            value: "oracle_canister".to_string(),
        },
    ];

    let request = CanisterHttpRequestArgument {
        url: url.clone(),
        method,
        body,
        max_response_bytes: Some(MAX_RESPONSE_BYTES),
        // transform: Some(TransformContext::new(transform, vec![])),
        transform: Some(TransformContext {
            function: TransformFunc(candid::Func {
                principal: ic_cdk::api::id(),
                method: "transform".to_string(),
            }),
            context: vec![],
        }),
        headers: request_headers,
    };

    ic_cdk::api::print(format!("Requesting url: {}", url.to_string()));
    log_message(format!("Requesting url: {}", url.to_string()));

    match http_request(request).await {
        Ok((response, )) => {
            ic_cdk::api::print(format!("Response status: {}", response.status));
            log_message(format!("Response status: {}", response.status));

            let decoded_body = String::from_utf8(response.body)
                .expect("Remote service response is not UTF-8 encoded.");

            ic_cdk::api::print(format!("Response body: {}", decoded_body));
            log_message(format!("Response body: {}", decoded_body));

            Ok(decoded_body)
        },
        Err((code, message)) => {
            ic_cdk::api::print(format!("Error: {}", message));
            log_message(format!("Error: {}", message));
            Err((code, message))
        }
    }
}
