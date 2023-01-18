# Orally

### On-chain oracle. 

#### Factory for oracle creation with different type of data, chain, rpc. Oracle subscriptions with contract and method where data to deliver. 

### Local setup

```
dfx start --background

dfx canister create --all

dfx build oracle

mv ./.dfx/local/canisters/oracle/oracle.wasm ./src/oracle_factory/src/build/oracle.wasm
gzip ./src/oracle_factory/src/build/oracle.wasm

dfx build oracle_factory

dfx canister install oracle_factory
```

Go to your local candid UI and create oracle with your endpoints, chain, rpc, frequency. 

Go to Remix and deploy contract from `src/oracle/src/contracts/icp_price.sol`

Go you your local candid UI of recently created oracle canister and subscribe with your deployed contract and `set_price` method.

