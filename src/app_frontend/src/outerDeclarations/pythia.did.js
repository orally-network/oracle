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
  const CandidSub = IDL.Record({
    'id' : IDL.Nat,
    'contract_addr' : IDL.Text,
    'method_abi' : IDL.Text,
    'is_random' : IDL.Bool,
    'chain_id' : IDL.Nat,
    'method_name' : IDL.Text,
    'frequency' : IDL.Nat,
  });
  const GetSubsResult = IDL.Variant({
    'Ok' : IDL.Vec(CandidSub),
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'add_chain' : IDL.Func([IDL.Nat, IDL.Text, IDL.Nat, IDL.Text], [Error], []),
    'add_user' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'get_chain_rpc' : IDL.Func([IDL.Nat], [Result], []),
    'get_chains' : IDL.Func([], [GetChainsResponse], []),
    'get_controllers' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'get_subs' : IDL.Func([IDL.Text], [GetSubsResult], []),
    'refresh_subs' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [Error], []),
    'remove_chain' : IDL.Func([IDL.Nat], [Error], []),
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
    'update_tx_fee' : IDL.Func([IDL.Nat], [Error], []),
  });
};
export const init = ({ IDL }) => { return []; };
