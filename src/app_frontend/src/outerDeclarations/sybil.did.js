export const idlFactory = ({ IDL }) => {
  const RateDataLight = IDL.Record({
    'decimals' : IDL.Nat64,
    'signature' : IDL.Opt(IDL.Text),
    'rate' : IDL.Nat64,
    'timestamp' : IDL.Nat64,
    'symbol' : IDL.Text,
  });
  const Pair = IDL.Record({
    'id' : IDL.Text,
    'data' : RateDataLight,
    'frequency' : IDL.Nat64,
    'last_update' : IDL.Nat64,
  });
  const AddPairResponse = IDL.Variant({ 'Ok' : Pair, 'Err' : IDL.Text });
  const CreateCustomPairRequest = IDL.Record({
    'msg' : IDL.Text,
    'sig' : IDL.Text,
    'uri' : IDL.Text,
    'resolver' : IDL.Text,
    'pair_id' : IDL.Text,
    'frequency' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const Error = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const TextResponse = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const GetAssetDataResponse = IDL.Variant({
    'Ok' : RateDataLight,
    'Err' : IDL.Text,
  });
  const GetAssetDataWithProofResponse = IDL.Variant({
    'Ok' : RateDataLight,
    'Err' : IDL.Text,
  });
  const Endpoint = IDL.Record({
    'uri' : IDL.Text,
    'resolver' : IDL.Text,
    'expected_bytes' : IDL.Nat64,
  });
  const CustomPair = IDL.Record({
    'id' : IDL.Text,
    'source' : Endpoint,
    'data' : RateDataLight,
    'frequency' : IDL.Nat64,
    'last_update' : IDL.Nat64,
  });
  return IDL.Service({
    'add_pair' : IDL.Func([IDL.Text, IDL.Nat], [AddPairResponse], []),
    'create_custom_pair' : IDL.Func([CreateCustomPairRequest], [Error], []),
    'eth_address' : IDL.Func([], [TextResponse], []),
    'get_asset_data' : IDL.Func([IDL.Text], [GetAssetDataResponse], []),
    'get_asset_data_with_proof' : IDL.Func(
        [IDL.Text],
        [GetAssetDataWithProofResponse],
        [],
      ),
    'get_cost_per_execution' : IDL.Func([], [IDL.Nat], []),
    'get_custom_pairs' : IDL.Func([], [IDL.Vec(CustomPair)], []),
    'get_exchange_rate_canister' : IDL.Func([], [IDL.Text], []),
    'get_expiration_time' : IDL.Func([], [IDL.Nat], []),
    'get_key_name' : IDL.Func([], [IDL.Text], []),
    'get_pairs' : IDL.Func([], [IDL.Vec(Pair)], []),
    'get_proxy_ecdsa_canister' : IDL.Func([], [IDL.Text], []),
    'get_siwe_signer_canister' : IDL.Func([], [IDL.Text], []),
    'get_treasurer_canister' : IDL.Func([], [IDL.Text], []),
    'init_controllers' : IDL.Func([], [], []),
    'is_pair_exists' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'remove_custom_pair' : IDL.Func([IDL.Text], [], []),
    'remove_pair' : IDL.Func([IDL.Text], [], []),
    'set_cost_per_execution' : IDL.Func([IDL.Nat], [], []),
    'set_exchange_rate_canister' : IDL.Func([IDL.Text], [], []),
    'set_expiration_time' : IDL.Func([IDL.Nat], [], []),
    'set_key_name' : IDL.Func([IDL.Text], [], []),
    'set_proxy_ecdsa_canister' : IDL.Func([IDL.Text], [], []),
    'set_siwe_signer_canister' : IDL.Func([IDL.Text], [], []),
    'set_treasurer_canister' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
