export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Source = IDL.Record({
    'uri' : IDL.Text,
    'resolver' : IDL.Text,
    'expected_bytes' : IDL.Nat64,
  });
  const CreateCustomPairRequest = IDL.Record({
    'msg' : IDL.Text,
    'sig' : IDL.Text,
    'decimals' : IDL.Nat,
    'update_freq' : IDL.Nat,
    'sources' : IDL.Vec(Source),
    'pair_id' : IDL.Text,
  });
  const CreateDataFetcherRequest = IDL.Record({
    'msg' : IDL.Text,
    'sig' : IDL.Text,
    'update_freq' : IDL.Nat,
    'sources' : IDL.Vec(Source),
  });
  const NatResponse = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text });
  const CreateDefaultPairRequest = IDL.Record({
    'decimals' : IDL.Nat,
    'update_freq' : IDL.Nat,
    'pair_id' : IDL.Text,
  });
  const TextResponse = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const RateDataLight = IDL.Record({
    'decimals' : IDL.Nat64,
    'signature' : IDL.Opt(IDL.Text),
    'rate' : IDL.Nat64,
    'timestamp' : IDL.Nat64,
    'symbol' : IDL.Text,
  });
  const GetAssetDataResponse = IDL.Variant({
    'Ok' : RateDataLight,
    'Err' : IDL.Text,
  });
  const GetAssetDataWithProofResponse = IDL.Variant({
    'Ok' : RateDataLight,
    'Err' : IDL.Text,
  });
  const BalancesCfg = IDL.Record({
    'rpc' : IDL.Text,
    'erc20_contract' : IDL.Nat,
    'fee_per_byte' : IDL.Nat,
    'chain_id' : IDL.Nat,
  });
  const Cfg = IDL.Record({
    'mock' : IDL.Bool,
    'exchange_rate_canister' : IDL.Text,
    'balances_cfg' : BalancesCfg,
    'key_name' : IDL.Text,
  });
  const GetCfgResponse = IDL.Variant({ 'Ok' : Cfg, 'Err' : IDL.Text });
  const DataFetcher = IDL.Record({
    'id' : IDL.Nat,
    'owner' : IDL.Text,
    'update_freq' : IDL.Nat,
    'sources' : IDL.Vec(Source),
  });
  const PairStatus = IDL.Record({
    'requests_counter' : IDL.Nat64,
    'updated_counter' : IDL.Nat64,
    'last_update' : IDL.Nat64,
  });
  const PairType = IDL.Variant({
    'Default' : IDL.Null,
    'Custom' : IDL.Record({ 'sources' : IDL.Vec(Source) }),
  });
  const Pair = IDL.Record({
    'id' : IDL.Text,
    'status' : PairStatus,
    'decimals' : IDL.Nat64,
    'owner' : IDL.Text,
    'data' : IDL.Opt(RateDataLight),
    'update_freq' : IDL.Nat64,
    'pair_type' : PairType,
  });
  const GetWhitelistResponse = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Text),
    'Err' : IDL.Text,
  });
  const BoolResponse = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const UpdateCfg = IDL.Record({
    'mock' : IDL.Opt(IDL.Bool),
    'exchange_rate_canister' : IDL.Opt(IDL.Text),
    'balances_cfg' : IDL.Opt(BalancesCfg),
    'key_name' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'add_to_whitelist' : IDL.Func([IDL.Text], [Error], []),
    'clear_state' : IDL.Func([], [Error], []),
    'create_custom_pair' : IDL.Func([CreateCustomPairRequest], [Error], []),
    'create_data_fetcher' : IDL.Func(
        [CreateDataFetcherRequest],
        [NatResponse],
        [],
      ),
    'create_default_pair' : IDL.Func([CreateDefaultPairRequest], [Error], []),
    'deposit' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Error], []),
    'eth_address' : IDL.Func([], [TextResponse], []),
    'get_asset_data' : IDL.Func([IDL.Text], [GetAssetDataResponse], []),
    'get_asset_data_with_proof' : IDL.Func(
        [IDL.Text],
        [GetAssetDataWithProofResponse],
        [],
      ),
    'get_balance' : IDL.Func([IDL.Text], [NatResponse], []),
    'get_cfg' : IDL.Func([], [GetCfgResponse], []),
    'get_data' : IDL.Func([IDL.Nat], [TextResponse], []),
    'get_data_fetchers' : IDL.Func([IDL.Text], [IDL.Vec(DataFetcher)], []),
    'get_pairs' : IDL.Func([], [IDL.Vec(Pair)], []),
    'get_whitelist' : IDL.Func([], [GetWhitelistResponse], []),
    'is_pair_exists' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'is_whitelisted' : IDL.Func([IDL.Text], [BoolResponse], []),
    'remove_custom_pair' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Error],
        [],
      ),
    'remove_data_fetcher' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text],
        [Error],
        [],
      ),
    'remove_default_pair' : IDL.Func([IDL.Text], [Error], []),
    'remove_from_whitelist' : IDL.Func([IDL.Text], [Error], []),
    'update_cfg' : IDL.Func([UpdateCfg], [Error], []),
    'withdraw' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Text],
        [TextResponse],
        [],
      ),
    'withdraw_fees' : IDL.Func([IDL.Text], [TextResponse], []),
  });
};
export const init = ({ IDL }) => { return []; };
