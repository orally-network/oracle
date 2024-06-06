export const idlFactory = ({ IDL }) => {
  const AddApolloInstanceRequest = IDL.Record({
    'chain_rpc' : IDL.Text,
    'apollo_coordinator' : IDL.Text,
    'chain_id' : IDL.Nat,
    'multicall_address' : IDL.Text,
    'block_gas_limit' : IDL.Nat,
    'min_balance' : IDL.Nat,
    'timer_frequency_sec' : IDL.Nat64,
    'apollos_fee' : IDL.Nat,
    'evm_rpc_canister' : IDL.Text,
  });
  const UtilsError = IDL.Variant({
    'FromHexError' : IDL.Text,
    'NotAController' : IDL.Null,
    'FailedToGetApolloEvmAddress' : IDL.Text,
    'InvalidAddressFormat' : IDL.Text,
  });
  const WithdrawRequestsError = IDL.Variant({
    'UtilsError' : UtilsError,
    'UnableToCleanWithdrawRequests' : IDL.Text,
    'UnableToAddWithdrawRequest' : IDL.Text,
  });
  const BalancesError = IDL.Variant({
    'NotEnoughFunds' : IDL.Null,
    'BalanceAlreadyExists' : IDL.Null,
    'UtilsError' : UtilsError,
    'NonceIsTooLow' : IDL.Null,
    'BalanceDoesNotExist' : IDL.Null,
  });
  const Web3Error = IDL.Variant({
    'UnableToEstimateGas' : IDL.Text,
    'TxHasFailed' : IDL.Null,
    'TxWithoutReceiver' : IDL.Null,
    'UnableToSignContractCall' : IDL.Text,
    'UnableToDecodeOutput' : IDL.Text,
    'UnableToCreateContract' : IDL.Text,
    'UnableToGetTxReceipt' : IDL.Text,
    'TxNotFound' : IDL.Null,
    'UnableToCallContract' : IDL.Text,
    'UtilsError' : UtilsError,
    'UnableToGetBlockNumber' : IDL.Text,
    'UnableToExecuteRawTx' : IDL.Text,
    'UnableToGetNonce' : IDL.Text,
    'UnableToGetGasPrice' : IDL.Text,
    'TxTimeout' : IDL.Null,
    'UnableToFormCallData' : IDL.Text,
    'InvalidAddressFormat' : IDL.Text,
    'UnableToGetLogs' : IDL.Text,
  });
  const ApolloInstanceError = IDL.Variant({
    'FailedToUpgrade' : IDL.Text,
    'FailedToStop' : IDL.Text,
    'WithdrawRequestsError' : WithdrawRequestsError,
    'BalancesError' : BalancesError,
    'FailedToUpdateSettings' : IDL.Text,
    'UtilsError' : UtilsError,
    'Web3Error' : Web3Error,
    'FailedToInstallCode' : IDL.Text,
    'ApolloCoordinatorPoolingError' : IDL.Text,
    'FailedToDelete' : IDL.Text,
    'FailedToRestartTimer' : IDL.Text,
    'FailedToCreate' : IDL.Text,
    'TxWasNotSentToAMA' : IDL.Null,
  });
  const ApolloError = IDL.Variant({
    'UtilsError' : UtilsError,
    'FailedToGetCanisterStatus' : IDL.Text,
    'ApolloInstanceError' : ApolloInstanceError,
    'ChainNotFound' : IDL.Nat,
    'CommunicationWithApolloInstanceFailed' : IDL.Text,
    'ChainAlreadyExists' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ApolloError });
  const ApolloInstance = IDL.Record({
    'apollo_main_address' : IDL.Text,
    'canister_id' : IDL.Principal,
    'chain_id' : IDL.Nat,
    'is_active' : IDL.Bool,
  });
  const StringResult = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : ApolloError });
  const ApolloInstanceMetadata = IDL.Record({
    'sybil_canister_address' : IDL.Text,
    'chain_rpc' : IDL.Text,
    'apollo_coordinator' : IDL.Text,
    'apollo_evm_address' : IDL.Opt(IDL.Text),
    'chain_id' : IDL.Nat,
    'multicall_address' : IDL.Text,
    'key_name' : IDL.Text,
    'block_gas_limit' : IDL.Nat,
    'min_balance' : IDL.Nat,
    'apollos_fee' : IDL.Nat,
    'evm_rpc_canister' : IDL.Text,
  });
  const ApolloInstanceMetadataResult = IDL.Variant({
    'Ok' : ApolloInstanceMetadata,
    'Err' : ApolloError,
  });
  const Pagination = IDL.Record({ 'page' : IDL.Nat64, 'size' : IDL.Nat64 });
  const GetApolloInstanceResult = IDL.Record({
    'chain_id' : IDL.Nat32,
    'apollo_instance' : ApolloInstance,
  });
  const PaginationResult = IDL.Record({
    'page' : IDL.Nat64,
    'total_pages' : IDL.Nat64,
    'size' : IDL.Nat64,
    'total_items' : IDL.Nat64,
    'items' : IDL.Vec(GetApolloInstanceResult),
  });
  const NatResult = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : ApolloError });
  const Metadata = IDL.Record({
    'sybil_canister_address' : IDL.Text,
    'key_name' : IDL.Text,
  });
  const UpdateMetadata = IDL.Record({
    'sybil_canister_address' : IDL.Opt(IDL.Text),
    'chain_rpc' : IDL.Opt(IDL.Text),
    'apollo_coordinator' : IDL.Opt(IDL.Text),
    'chain_id' : IDL.Opt(IDL.Nat),
    'multicall_address' : IDL.Opt(IDL.Text),
    'block_gas_limit' : IDL.Opt(IDL.Nat),
    'min_balance' : IDL.Opt(IDL.Nat),
    'apollos_fee' : IDL.Opt(IDL.Nat),
    'evm_rpc_canister' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'add_apollo_instance' : IDL.Func([AddApolloInstanceRequest], [Result], []),
    'add_apollo_instances_manually' : IDL.Func(
        [IDL.Vec(ApolloInstance)],
        [Result],
        [],
      ),
    'deposit' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Opt(IDL.Text), IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'get_ama' : IDL.Func([IDL.Nat], [StringResult], []),
    'get_apollo_instance_metadata' : IDL.Func(
        [IDL.Nat],
        [ApolloInstanceMetadataResult],
        [],
      ),
    'get_apollo_instances' : IDL.Func(
        [IDL.Opt(Pagination)],
        [PaginationResult],
        ['query'],
      ),
    'get_balance' : IDL.Func([IDL.Nat, IDL.Text], [NatResult], []),
    'get_metadata' : IDL.Func([], [Metadata], ['query']),
    'grant' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [Result], []),
    'remove_apollo_instance' : IDL.Func([IDL.Nat], [Result], []),
    'restrict' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'start' : IDL.Func([IDL.Nat], [Result], []),
    'start_once' : IDL.Func([IDL.Nat], [Result], []),
    'stop' : IDL.Func([IDL.Nat], [Result], []),
    'update_apollo_instance_metadata' : IDL.Func(
        [IDL.Nat, UpdateMetadata],
        [Result],
        [],
      ),
    'update_last_parsed_logs_from_block' : IDL.Func(
        [IDL.Nat, IDL.Opt(IDL.Nat64)],
        [Result],
        [],
      ),
    'update_metadata' : IDL.Func([UpdateMetadata], [Result], []),
    'update_timer_frequency_sec' : IDL.Func([IDL.Nat, IDL.Nat64], [Result], []),
    'upgrade_chains' : IDL.Func([], [Result], []),
    'withdraw' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return [IDL.Text, IDL.Text]; };
