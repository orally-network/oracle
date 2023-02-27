use crate::*;

pub fn validate_owner_caller() -> () {
    let owner = OWNER.with(|owner| owner.borrow().clone());
    
    match Principal::from_text(owner) {
        Ok(caller) if caller == ic_cdk::caller() => (),
        _ => ic_cdk::trap("Invalid caller")
    }
}

pub fn remove_abi_from_subscription(subscription: Subscription) -> Subscription {
    let mut subscription = subscription.clone();
    subscription.abi = None;
    
    subscription
}
