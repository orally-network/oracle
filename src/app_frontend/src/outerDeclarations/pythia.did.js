export const idlFactory = ({ IDL }) => {
  const CreateChainRequest = IDL.Record({
    'fee' : IDL.Nat,
    'rpc' : IDL.Text,
    'chain_id' : IDL.Nat,
    'block_gas_limit' : IDL.Nat,
    'min_balance' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const Error = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const GetBalanceResponse = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text });
  const GetChainRPCResponse = IDL.Variant({
    'Ok' : IDL.Text,
    'Err' : IDL.Text,
  });
  const Chain = IDL.Record({
    'fee' : IDL.Opt(IDL.Nat),
    'rpc' : IDL.Text,
    'chain_id' : IDL.Nat,
    'block_gas_limit' : IDL.Nat,
    'min_balance' : IDL.Nat,
    'symbol' : IDL.Opt(IDL.Text),
  });
  const GetPMAResponse = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const ExecutionCondition = IDL.Record({
    'frequency' : IDL.Nat,
    'price_mutation': IDL.Record({
      'mutation_rate': IDL.Nat,
      'pair_id': IDL.Text,
      'creation_price': IDL.Nat,
      // 'price_mutation_type': PriceMutationType,
    })}
  );
  // const PriceMutationType = 
  const SubscriptionStatus = IDL.Record({
    'is_active' : IDL.Bool,
    'last_update' : IDL.Nat,
    'executions_counter' : IDL.Nat,
  });
  const MethodType = IDL.Variant({
    'Empty' : IDL.Null,
    'Pair' : IDL.Text,
    'Random' : IDL.Text,
  });
  const Method = IDL.Record({
    'abi' : IDL.Text,
    'name' : IDL.Text,
    'chain_id' : IDL.Nat,
    'method_type' : MethodType,
    'gas_limit' : IDL.Nat,
    // 'exec_condition': IDL.Vec({
    //   'frequency' : IDL.Nat,
    //   'price_mutation': IDL.Record({
    //     'mutation_rate': IDL.Nat,
    //     'pair_id': IDL.Text,
    //     'creation_price': IDL.Nat,
    // }),
  // })
  });
  const Subscription = IDL.Record({
    'id' : IDL.Nat,
    'contract_addr' : IDL.Text,
    'status' : SubscriptionStatus,
    'method' : Method,
    'owner' : IDL.Text,
  });
  const WhitelistEntry = IDL.Record({
    'is_blacklisted' : IDL.Bool,
    'address' : IDL.Text,
  });
  const Whitelist = IDL.Vec(WhitelistEntry);
  const GetWhiteListResponse = IDL.Variant({
    'Ok' : Whitelist,
    'Err' : IDL.Text,
  });
  const IsWhitelistedResponse = IDL.Variant({
    'Ok' : IDL.Bool,
    'Err' : IDL.Text,
  });
  const SubscribeRequest = IDL.Record({
    'msg' : IDL.Text,
    'sig' : IDL.Text,
    'contract_addr' : IDL.Text,
    'method_abi' : IDL.Text,
    'is_random' : IDL.Bool,
    'chain_id' : IDL.Nat,
    'gas_limit' : IDL.Nat,
    'pair_id' : IDL.Opt(IDL.Text),
    'frequency' : IDL.Nat,
  });
  const SubscribeResponse = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text });
  const UpdateSubscriptionRequest = IDL.Record({
    'id' : IDL.Nat,
    'msg' : IDL.Text,
    'sig' : IDL.Text,
    'contract_addr' : IDL.Opt(IDL.Text),
    'method_abi' : IDL.Opt(IDL.Text),
    'is_random' : IDL.Opt(IDL.Bool),
    'chain_id' : IDL.Nat,
    'gas_limit' : IDL.Opt(IDL.Nat),
    'pair_id' : IDL.Opt(IDL.Text),
    'frequency' : IDL.Opt(IDL.Nat),
  });
  return IDL.Service({
    'add_chain' : IDL.Func([CreateChainRequest], [Error], []),
    'add_to_whitelist' : IDL.Func([IDL.Text], [Error], []),
    'blacklist' : IDL.Func([IDL.Text], [Error], []),
    'deposit' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [Error], []),
    'execute_publisher_job' : IDL.Func([], [Error], []),
    'execute_withdraw_job' : IDL.Func([], [Error], []),
    'get_balance' : IDL.Func([IDL.Nat, IDL.Text], [GetBalanceResponse], []),
    'get_chain_rpc' : IDL.Func([IDL.Nat], [GetChainRPCResponse], []),
    'get_chains' : IDL.Func([], [IDL.Vec(Chain)], []),
    'get_pma' : IDL.Func([], [GetPMAResponse], []),
    'get_subscriptions' : IDL.Func(
      [IDL.Opt(IDL.Text)],
      [IDL.Vec(Subscription)],
      [],
    ),
    'get_whitelist' : IDL.Func([], [GetWhiteListResponse], []),
    'is_whitelisted' : IDL.Func([IDL.Text], [IsWhitelistedResponse], []),
    'remove_chain' : IDL.Func([IDL.Nat], [Error], []),
    'remove_from_whitelist' : IDL.Func([IDL.Text], [Error], []),
    'remove_subscription' : IDL.Func([IDL.Nat], [Error], []),
    'remove_subscriptions' : IDL.Func([], [Error], []),
    'start_subscription' : IDL.Func(
      [IDL.Nat, IDL.Nat, IDL.Text, IDL.Text],
      [Error],
      [],
    ),
    'stop_subscription' : IDL.Func(
      [IDL.Nat, IDL.Nat, IDL.Text, IDL.Text],
      [Error],
      [],
    ),
    'stop_subscriptions' : IDL.Func([], [Error], []),
    'stop_timer' : IDL.Func([], [Error], []),
    'subscribe' : IDL.Func([SubscribeRequest], [SubscribeResponse], []),
    'unblacklist' : IDL.Func([IDL.Text], [Error], []),
    'update_chain_block_gas_limit' : IDL.Func([IDL.Nat, IDL.Nat], [Error], []),
    'update_chain_fee_and_symbol' : IDL.Func(
      [IDL.Nat, IDL.Nat, IDL.Text],
      [Error],
      [],
    ),
    'update_chain_min_balance' : IDL.Func([IDL.Nat, IDL.Nat], [Error], []),
    'update_chain_rpc' : IDL.Func([IDL.Nat, IDL.Text], [Error], []),
    'update_subs_limit_total' : IDL.Func([IDL.Nat], [Error], []),
    'update_subs_limit_wallet' : IDL.Func([IDL.Nat], [Error], []),
    'update_subscription' : IDL.Func([UpdateSubscriptionRequest], [Error], []),
    'update_timer_frequency' : IDL.Func([IDL.Nat], [Error], []),
    'update_tx_fee' : IDL.Func([IDL.Nat], [Error], []),
    'withdraw' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [Error], []),
    'withdraw_all_balance' : IDL.Func([IDL.Nat, IDL.Text], [Error], []),
    'withdraw_fee' : IDL.Func([IDL.Nat, IDL.Text], [Error], []),
  });
};
export const init = ({ IDL }) => { return []; };
