export const idlFactory = ({ IDL }) => {
  const DepositType = IDL.Variant({ 'Erc20' : IDL.Null });
  const DepositRequest = IDL.Record({
    'deposit_type' : DepositType,
    'taxpayer' : IDL.Text,
    'amount' : IDL.Nat,
  });
  const Error = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const TextResponse = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const InitConfig = IDL.Record({
    'chain_rpc' : IDL.Text,
    'siwe_signer_canister' : IDL.Principal,
    'key_name' : IDL.Text,
    'treasurer' : IDL.Text,
    'token_addr' : IDL.Text,
  });
  return IDL.Service({
    'deposit' : IDL.Func([DepositRequest], [Error], []),
    'get_taxpayer' : IDL.Func([IDL.Text], [TextResponse], []),
    'init' : IDL.Func([InitConfig], [], []),
    'init_controllers' : IDL.Func([], [], []),
    'register_taxpayer' : IDL.Func([IDL.Text, IDL.Text], [TextResponse], []),
  });
};
export const init = ({ IDL }) => { return []; };
