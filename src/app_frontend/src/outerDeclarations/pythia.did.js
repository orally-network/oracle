export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const CandidTypeChain = IDL.Record({
    'rpc' : IDL.Text,
    'chain_id' : IDL.Nat,
    'min_balance' : IDL.Nat,
    'treasurer' : IDL.Text,
  });
  const GetChainsResponse = IDL.Variant({
    'Ok' : IDL.Vec(CandidTypeChain),
    'Err' : IDL.Text,
  });
  const SubType = IDL.Variant({
    'Empty' : IDL.Null,
    'Pair' : IDL.Null,
    'Random' : IDL.Text,
  });
  const CandidSub = IDL.Record({
    'id' : IDL.Nat,
    'contract_addr' : IDL.Text,
    'method_abi' : IDL.Text,
    'chain_id' : IDL.Nat,
    'method_name' : IDL.Text,
    'method_type' : SubType,
    'pair_id' : IDL.Opt(IDL.Text),
    'is_active' : IDL.Bool,
    'frequency' : IDL.Nat,
  });
  const GetSubsResult = IDL.Variant({
    'Ok' : IDL.Vec(CandidSub),
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'add_chain' : IDL.Func([IDL.Nat, IDL.Text, IDL.Nat, IDL.Text], [Error], []),
    'get_chain_rpc' : IDL.Func([IDL.Nat], [Result], []),
    'get_chains' : IDL.Func([], [GetChainsResponse], []),
    'get_exec_addr' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'get_subs' : IDL.Func([IDL.Text], [GetSubsResult], []),
    'refresh_subs' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [Error], []),
    'remove_chain' : IDL.Func([IDL.Nat], [Error], []),
    'remove_subs' : IDL.Func([], [Error], []),
    'start_sub' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [Error], []),
    'stop_sub' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [Error], []),
    'stop_subs' : IDL.Func([], [Error], []),
    'subscribe' : IDL.Func(
        [
          IDL.Nat,
          IDL.Opt(IDL.Text),
          IDL.Text,
          IDL.Text,
          IDL.Nat,
          IDL.Bool,
          IDL.Text,
          IDL.Text,
        ],
        [Error],
        [],
      ),
    'update_chain_min_balance' : IDL.Func([IDL.Nat, IDL.Nat], [Error], []),
    'update_chain_rpc' : IDL.Func([IDL.Nat, IDL.Text], [Error], []),
    'update_controllers' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'update_subs_limit_total' : IDL.Func([IDL.Nat], [Error], []),
    'update_subs_limit_wallet' : IDL.Func([IDL.Nat], [Error], []),
    'update_tx_fee' : IDL.Func([IDL.Nat], [Error], []),
    'withdraw' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [Error], []),
  });
};
export const init = ({ IDL }) => { return []; };
