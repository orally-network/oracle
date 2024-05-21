export const idlFactory = ({ IDL }) => {
  const SolidityToken = IDL.Rec();
  const Error = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const ERC20Contract = IDL.Record({
    'erc20_contract' : IDL.Text,
    'decimals' : IDL.Nat64,
    'token_symbol' : IDL.Text,
  });
  const FeedType = IDL.Variant({
    'Default' : IDL.Null,
    'CustomNumber' : IDL.Null,
    'Custom' : IDL.Null,
    'CustomString' : IDL.Null,
  });
  const ApiKey = IDL.Record({ 'key' : IDL.Text, 'title' : IDL.Text });
  const HttpSource = IDL.Record({
    'uri' : IDL.Text,
    'resolver' : IDL.Text,
    'expected_bytes' : IDL.Opt(IDL.Nat64),
    'api_keys' : IDL.Opt(IDL.Vec(ApiKey)),
  });
  const EvmEventLogsSource = IDL.Record({
    'rpc' : IDL.Text,
    'event_abi' : IDL.Text,
    'topic' : IDL.Opt(IDL.Text),
    'log_index' : IDL.Nat32,
    'address' : IDL.Opt(IDL.Text),
    'to_block' : IDL.Opt(IDL.Nat64),
    'event_log_field_name' : IDL.Text,
    'from_block' : IDL.Opt(IDL.Nat64),
    'event_name' : IDL.Text,
  });
  const Source = IDL.Variant({
    'HttpSource' : HttpSource,
    'EvmEventLogsSource' : EvmEventLogsSource,
  });
  const CreateCustomFeedRequest = IDL.Record({
    'id' : IDL.Text,
    'msg' : IDL.Text,
    'sig' : IDL.Text,
    'feed_type' : FeedType,
    'decimals' : IDL.Opt(IDL.Nat64),
    'update_freq' : IDL.Nat,
    'sources' : IDL.Vec(Source),
  });
  const CreateDefaultFeedRequest = IDL.Record({
    'id' : IDL.Text,
    'decimals' : IDL.Nat,
    'update_freq' : IDL.Nat,
  });
  const TextResponse = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const GetAllChainsRPCResponse = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Vec(IDL.Text))),
    'Err' : IDL.Text,
  });
  const SaveAllowedChain = IDL.Record({
    'rpc' : IDL.Text,
    'erc20_contracts' : IDL.Vec(ERC20Contract),
    'coin_symbol' : IDL.Text,
  });
  const GetSaveAllowedChainsResponse = IDL.Vec(
    IDL.Tuple(IDL.Nat64, SaveAllowedChain)
  );
  const APIUser = IDL.Record({
    'last_request' : IDL.Nat64,
    'request_count_per_method' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64)),
    'request_count_per_domain' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64)),
    'address' : IDL.Text,
    'banned_domains' : IDL.Vec(IDL.Text),
    'request_limit_by_domain' : IDL.Nat64,
    'request_count' : IDL.Nat64,
    'request_limit' : IDL.Nat64,
  });
  const SybilAPIKey = IDL.Record({
    'user_to_keys' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Text))),
    'free_request_limit' : IDL.Nat64,
    'keys_to_user' : IDL.Vec(IDL.Tuple(IDL.Text, APIUser)),
  });
  const GetAPIKeysResponse = IDL.Variant({
    'Ok' : SybilAPIKey,
    'Err' : IDL.Text,
  });
  const AssetData = IDL.Variant({
    'CustomPriceFeed' : IDL.Record({
      'decimals' : IDL.Nat64,
      'rate' : IDL.Nat64,
      'timestamp' : IDL.Nat64,
      'symbol' : IDL.Text,
    }),
    'CustomNumber' : IDL.Record({
      'id' : IDL.Text,
      'decimals' : IDL.Nat64,
      'value' : IDL.Nat64,
    }),
    'DefaultPriceFeed' : IDL.Record({
      'decimals' : IDL.Nat64,
      'rate' : IDL.Nat64,
      'timestamp' : IDL.Nat64,
      'symbol' : IDL.Text,
    }),
    'CustomString' : IDL.Record({ 'id' : IDL.Text, 'value' : IDL.Text }),
  });
  const AssetDataResult = IDL.Record({
    'signature' : IDL.Opt(IDL.Text),
    'data' : AssetData,
  });
  const GetAssetDataResponse = IDL.Variant({
    'Ok' : AssetDataResult,
    'Err' : IDL.Text,
  });
  const GetAssetDataWithProofResponse = IDL.Variant({
    'Ok' : AssetDataResult,
    'Err' : IDL.Text,
  });
  const NatResponse = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text });
  const BalancesCfg = IDL.Record({
    'rpc' : IDL.Text,
    'erc20_contract' : IDL.Text,
    'base_fee' : IDL.Nat,
    'fee_per_byte' : IDL.Nat,
    'whitelist' : IDL.Vec(IDL.Text),
    'chain_id' : IDL.Nat,
    'allowed_chains' : IDL.Vec(IDL.Tuple(IDL.Nat64, SaveAllowedChain)),
    'treasure_address' : IDL.Text,
  });
  const Cfg = IDL.Record({
    'fallback_xrc' : IDL.Principal,
    'mock' : IDL.Bool,
    'rpc_wrapper' : IDL.Text,
    'exchange_rate_canister' : IDL.Principal,
    'balances_cfg' : BalancesCfg,
    'key_name' : IDL.Text,
    'evm_rpc_canister' : IDL.Principal,
  });
  const GetCfgResponse = IDL.Variant({ 'Ok' : Cfg, 'Err' : IDL.Text });
  const GetChainsRPCResponse = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Text),
    'Err' : IDL.Text,
  });
  const FeedStatus = IDL.Record({
    'requests_counter' : IDL.Nat64,
    'updated_counter' : IDL.Nat64,
    'last_update' : IDL.Nat64,
  });
  const Feed = IDL.Record({
    'id' : IDL.Text,
    'feed_type' : FeedType,
    'status' : FeedStatus,
    'decimals' : IDL.Opt(IDL.Nat64),
    'owner' : IDL.Text,
    'new_sources' : IDL.Opt(IDL.Vec(Source)),
    'data' : IDL.Opt(AssetDataResult),
    'update_freq' : IDL.Nat64,
    'sources' : IDL.Opt(IDL.Vec(HttpSource)),
  });
  const GetFeedResponse = IDL.Variant({
    'Ok' : IDL.Opt(Feed),
    'Err' : IDL.Text,
  });
  const FeedTypeFilter = IDL.Variant({
    'Default' : IDL.Null,
    'Custom' : IDL.Null,
  });
  const GetFeedsFilter = IDL.Record({
    'feed_type' : IDL.Opt(FeedTypeFilter),
    'owner' : IDL.Opt(IDL.Text),
    'search' : IDL.Opt(IDL.Text),
  });
  const Pagination = IDL.Record({ 'page' : IDL.Nat64, 'size' : IDL.Nat64 });
  const GetFeedsResultWithPagination = IDL.Record({
    'page' : IDL.Nat64,
    'total_pages' : IDL.Nat64,
    'size' : IDL.Nat64,
    'total_items' : IDL.Nat64,
    'items' : IDL.Vec(Feed),
  });
  const GetFeedsResponse = IDL.Variant({
    'Ok' : GetFeedsResultWithPagination,
    'Err' : IDL.Text,
  });
  const MultipleAssetsDataResult = IDL.Record({
    'signature' : IDL.Opt(IDL.Text),
    'data' : IDL.Vec(AssetData),
  });
  const GetMultipleAssetsDataResponse = IDL.Variant({
    'Ok' : MultipleAssetsDataResult,
    'Err' : IDL.Text,
  });
  const APIRequest = IDL.Record({
    'last_request' : IDL.Nat64,
    'method' : IDL.Text,
    'count' : IDL.Nat,
  });
  const GetRequestsByDomainResponse = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, APIRequest)),
    'Err' : IDL.Text,
  });
  const GetUserAPIKeysResponse = IDL.Variant({
    'Ok' : IDL.Opt(IDL.Vec(IDL.Text)),
    'Err' : IDL.Text,
  });
  const GetUserByKeyResponse = IDL.Variant({
    'Ok' : IDL.Opt(APIUser),
    'Err' : IDL.Text,
  });
  const GetWhitelistResponse = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Text),
    'Err' : IDL.Text,
  });
  const GetXRCData = IDL.Record({
    'decimals' : IDL.Nat64,
    'rate' : IDL.Nat64,
    'timestamp' : IDL.Nat64,
    'symbol' : IDL.Text,
  });
  const GetXRCDataMetadata = IDL.Record({
    'id' : IDL.Text,
    'fee' : IDL.Nat,
    'timestamp' : IDL.Nat64,
    'fee_symbol' : IDL.Text,
  });
  const GetXRCDataResult = IDL.Record({
    'signature' : IDL.Opt(IDL.Text),
    'data' : GetXRCData,
    'meta' : GetXRCDataMetadata,
  });
  const GetXRCDataResponse = IDL.Variant({
    'Ok' : GetXRCDataResult,
    'Err' : IDL.Text,
  });
  const BoolResponse = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  SolidityToken.fill(
    IDL.Variant({
      'Int' : IDL.Text,
      'FixedArray' : IDL.Vec(SolidityToken),
      'Bool' : IDL.Bool,
      'Uint' : IDL.Text,
      'String' : IDL.Text,
      'Bytes' : IDL.Vec(IDL.Nat8),
      'Address' : IDL.Text,
      'FixedBytes' : IDL.Vec(IDL.Nat8),
      'Tuple' : IDL.Vec(SolidityToken),
      'Array' : IDL.Vec(SolidityToken),
    })
  );
  const ReadContractMetadata = IDL.Record({
    'fee' : IDL.Nat,
    'method' : IDL.Text,
    'chain_id' : IDL.Nat64,
    'timestamp' : IDL.Nat64,
    'fee_symbol' : IDL.Text,
    'contract_address' : IDL.Text,
    'params' : IDL.Text,
  });
  const ReadContractResult = IDL.Record({
    'signature' : IDL.Opt(IDL.Text),
    'data' : IDL.Vec(SolidityToken),
    'meta' : ReadContractMetadata,
  });
  const ReadContractResponse = IDL.Variant({
    'Ok' : ReadContractResult,
    'Err' : IDL.Text,
  });
  const ReadLogsData = IDL.Record({
    'transaction_hash' : IDL.Opt(IDL.Text),
    'transaction_log_index' : IDL.Opt(IDL.Text),
    'block_hash' : IDL.Opt(IDL.Text),
    'log_index' : IDL.Opt(IDL.Text),
    'data' : IDL.Vec(IDL.Nat8),
    'transaction_index' : IDL.Opt(IDL.Nat64),
    'log_type' : IDL.Opt(IDL.Text),
    'block_number' : IDL.Opt(IDL.Nat64),
    'topics' : IDL.Vec(IDL.Text),
    'address' : IDL.Text,
    'removed' : IDL.Opt(IDL.Bool),
  });
  const ReadLogsMetadata = IDL.Record({
    'fee' : IDL.Nat,
    'block_to' : IDL.Opt(IDL.Nat64),
    'block_from' : IDL.Opt(IDL.Nat64),
    'chain_id' : IDL.Nat64,
    'addresses' : IDL.Opt(IDL.Vec(IDL.Text)),
    'timestamp' : IDL.Nat64,
    'fee_symbol' : IDL.Text,
    'topics0' : IDL.Opt(IDL.Vec(IDL.Text)),
    'topics1' : IDL.Opt(IDL.Vec(IDL.Text)),
    'topics2' : IDL.Opt(IDL.Vec(IDL.Text)),
    'topics3' : IDL.Opt(IDL.Vec(IDL.Text)),
  });
  const ReadLogsResult = IDL.Record({
    'signature' : IDL.Opt(IDL.Text),
    'data' : IDL.Vec(ReadLogsData),
    'meta' : ReadLogsMetadata,
  });
  const ReadLogsResponse = IDL.Variant({
    'Ok' : ReadLogsResult,
    'Err' : IDL.Text,
  });
  const UpdateBalancesCfg = IDL.Record({
    'base_fee' : IDL.Opt(IDL.Nat),
    'fee_per_byte' : IDL.Opt(IDL.Nat),
    'treasure_address' : IDL.Opt(IDL.Text),
  });
  const UpdateCfg = IDL.Record({
    'fallback_xrc' : IDL.Opt(IDL.Principal),
    'mock' : IDL.Opt(IDL.Bool),
    'rpc_wrapper' : IDL.Opt(IDL.Text),
    'exchange_rate_canister' : IDL.Opt(IDL.Principal),
    'balances_cfg' : IDL.Opt(UpdateBalancesCfg),
    'key_name' : IDL.Opt(IDL.Text),
    'evm_rpc_canister' : IDL.Opt(IDL.Principal),
  });
  return IDL.Service({
    'add_allowed_chain' : IDL.Func(
        [IDL.Nat64, IDL.Text, IDL.Text, IDL.Opt(IDL.Text)],
        [Error],
        [],
      ),
    'add_allowed_erc20_tokens' : IDL.Func(
        [IDL.Nat64, IDL.Vec(ERC20Contract)],
        [Error],
        [],
      ),
    'add_chain_rpc' : IDL.Func(
        [IDL.Nat64, IDL.Text, IDL.Opt(IDL.Text)],
        [Error],
        [],
      ),
    'add_to_balances_whitelist' : IDL.Func([IDL.Vec(IDL.Text)], [Error], []),
    'add_to_whitelist' : IDL.Func([IDL.Text], [Error], []),
    'allow_domain' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Error],
        [],
      ),
    'ban_domain' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Error],
        [],
      ),
    'change_public_status' : IDL.Func(
        [IDL.Text, IDL.Bool, IDL.Text, IDL.Text],
        [Error],
        [],
      ),
    'clear_state' : IDL.Func([], [Error], []),
    'create_custom_feed' : IDL.Func([CreateCustomFeedRequest], [Error], []),
    'create_default_feed' : IDL.Func([CreateDefaultFeedRequest], [Error], []),
    'deposit' : IDL.Func(
        [IDL.Nat64, IDL.Text, IDL.Opt(IDL.Text), IDL.Text, IDL.Text],
        [Error],
        [],
      ),
    'eth_address' : IDL.Func([], [TextResponse], []),
    'get_all_chains_rpc' : IDL.Func([], [GetAllChainsRPCResponse], []),
    'get_allowed_chains' : IDL.Func([], [GetSaveAllowedChainsResponse], []),
    'get_api_key' : IDL.Func([IDL.Text, IDL.Text], [TextResponse], []),
    'get_api_keys' : IDL.Func([], [GetAPIKeysResponse], []),
    'get_asset_data' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [GetAssetDataResponse],
        [],
      ),
    'get_asset_data_with_proof' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [GetAssetDataWithProofResponse],
        [],
      ),
    'get_balance' : IDL.Func([IDL.Text], [NatResponse], []),
    'get_cfg' : IDL.Func([], [GetCfgResponse], []),
    'get_chain_rpc' : IDL.Func([IDL.Nat64], [GetChainsRPCResponse], []),
    'get_feed' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [GetFeedResponse],
        [],
      ),
    'get_feeds' : IDL.Func(
        [
          IDL.Opt(GetFeedsFilter),
          IDL.Opt(Pagination),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [GetFeedsResponse],
        [],
      ),
    'get_multiple_assets_data' : IDL.Func(
        [IDL.Vec(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [GetMultipleAssetsDataResponse],
        [],
      ),
    'get_multiple_assets_data_with_proof' : IDL.Func(
        [IDL.Vec(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [GetMultipleAssetsDataResponse],
        [],
      ),
    'get_requests_by_domain' : IDL.Func([], [GetRequestsByDomainResponse], []),
    'get_treasure_address' : IDL.Func([], [IDL.Text], []),
    'get_user_api_keys' : IDL.Func([IDL.Text], [GetUserAPIKeysResponse], []),
    'get_user_by_key' : IDL.Func([IDL.Text], [GetUserByKeyResponse], []),
    'get_whitelist' : IDL.Func([], [GetWhitelistResponse], []),
    'get_xrc_data' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [GetXRCDataResponse],
        [],
      ),
    'get_xrc_data_with_proof' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [GetAssetDataResponse],
        [],
      ),
    'grant' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Error], []),
    'is_feed_exists' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'is_whitelisted' : IDL.Func([IDL.Text], [BoolResponse], []),
    'read_contract' : IDL.Func(
        [
          IDL.Nat64,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Nat64),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [ReadContractResponse],
        [],
      ),
    'read_logs' : IDL.Func(
        [
          IDL.Nat64,
          IDL.Opt(IDL.Nat64),
          IDL.Opt(IDL.Nat64),
          IDL.Opt(IDL.Vec(IDL.Text)),
          IDL.Opt(IDL.Vec(IDL.Text)),
          IDL.Opt(IDL.Vec(IDL.Text)),
          IDL.Opt(IDL.Vec(IDL.Text)),
          IDL.Opt(IDL.Vec(IDL.Text)),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
        ],
        [ReadLogsResponse],
        [],
      ),
    'remove_allowed_chain' : IDL.Func([IDL.Nat64], [Error], []),
    'remove_allowed_erc20_tokens' : IDL.Func(
        [IDL.Nat64, IDL.Vec(IDL.Text)],
        [Error],
        [],
      ),
    'remove_chain_rpc_by_index' : IDL.Func([IDL.Nat64, IDL.Nat64], [Error], []),
    'remove_chain_rpcs' : IDL.Func([IDL.Nat64], [Error], []),
    'remove_custom_feed' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Error],
        [],
      ),
    'remove_default_feed' : IDL.Func([IDL.Text], [Error], []),
    'remove_from_whitelist' : IDL.Func([IDL.Text], [Error], []),
    'restrict' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Error], []),
    'revoke_key' : IDL.Func([IDL.Text], [], []),
    'revoke_keys' : IDL.Func([IDL.Text], [Error], []),
    'sign_message' : IDL.Func([IDL.Text], [TextResponse], []),
    'update_cfg' : IDL.Func([UpdateCfg], [Error], []),
    'update_free_request_limit' : IDL.Func([IDL.Nat64], [Error], []),
    'update_request_limit' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Text, IDL.Text],
        [Error],
        [],
      ),
    'update_request_limit_by_domain' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Text, IDL.Text],
        [Error],
        [],
      ),
    'update_treasure_address' : IDL.Func([IDL.Text], [Error], []),
  });
};
export const init = ({ IDL }) => { return []; };
