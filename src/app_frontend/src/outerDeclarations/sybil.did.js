export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({ Ok: IDL.Null, Err: IDL.Text });
  const FeedType = IDL.Variant({
    Default: IDL.Null,
    CustomNumber: IDL.Null,
    Custom: IDL.Null,
    CustomString: IDL.Null,
  });
  const ApiKey = IDL.Record({ key: IDL.Text, title: IDL.Text });
  const HttpSource = IDL.Record({
    uri: IDL.Text,
    resolver: IDL.Text,
    expected_bytes: IDL.Opt(IDL.Nat64),
    api_keys: IDL.Opt(IDL.Vec(ApiKey)),
  });
  const EvmEventLogsSource = IDL.Record({
    rpc: IDL.Text,
    event_abi: IDL.Text,
    topic: IDL.Opt(IDL.Text),
    block_hash: IDL.Opt(IDL.Text),
    log_index: IDL.Nat32,
    address: IDL.Opt(IDL.Text),
    to_block: IDL.Opt(IDL.Nat64),
    event_log_field_name: IDL.Text,
    from_block: IDL.Opt(IDL.Nat64),
    event_name: IDL.Text,
  });
  const Source = IDL.Variant({
    HttpSource: HttpSource,
    EvmEventLogsSource: EvmEventLogsSource,
  });
  const CreateCustomFeedRequest = IDL.Record({
    id: IDL.Text,
    msg: IDL.Text,
    sig: IDL.Text,
    feed_type: FeedType,
    decimals: IDL.Opt(IDL.Nat64),
    update_freq: IDL.Nat,
    sources: IDL.Vec(Source),
  });
  const CreateDefaultFeedRequest = IDL.Record({
    id: IDL.Text,
    decimals: IDL.Nat,
    update_freq: IDL.Nat,
  });
  const TextResponse = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text });
  const AssetData = IDL.Variant({
    CustomPriceFeed: IDL.Record({
      decimals: IDL.Nat64,
      rate: IDL.Nat64,
      timestamp: IDL.Nat64,
      symbol: IDL.Text,
    }),
    CustomNumber: IDL.Record({
      id: IDL.Text,
      decimals: IDL.Nat64,
      value: IDL.Nat64,
    }),
    DefaultPriceFeed: IDL.Record({
      decimals: IDL.Nat64,
      rate: IDL.Nat64,
      timestamp: IDL.Nat64,
      symbol: IDL.Text,
    }),
    CustomString: IDL.Record({ id: IDL.Text, value: IDL.Text }),
  });
  const AssetDataResult = IDL.Record({
    signature: IDL.Opt(IDL.Text),
    data: AssetData,
  });
  const GetAssetDataResponse = IDL.Variant({
    Ok: AssetDataResult,
    Err: IDL.Text,
  });
  const GetAssetDataWithProofResponse = IDL.Variant({
    Ok: AssetDataResult,
    Err: IDL.Text,
  });
  const NatResponse = IDL.Variant({ Ok: IDL.Nat, Err: IDL.Text });
  const BalancesCfg = IDL.Record({
    rpc: IDL.Text,
    erc20_contract: IDL.Text,
    fee_per_byte: IDL.Nat,
    whitelist: IDL.Vec(IDL.Text),
    chain_id: IDL.Nat,
  });
  const Cfg = IDL.Record({
    fallback_xrc: IDL.Principal,
    mock: IDL.Bool,
    rpc_wrapper: IDL.Text,
    exchange_rate_canister: IDL.Principal,
    balances_cfg: BalancesCfg,
    key_name: IDL.Text,
    evm_rpc_canister: IDL.Principal,
  });
  const GetCfgResponse = IDL.Variant({ Ok: Cfg, Err: IDL.Text });
  const FeedStatus = IDL.Record({
    requests_counter: IDL.Nat64,
    updated_counter: IDL.Nat64,
    last_update: IDL.Nat64,
  });
  const Feed = IDL.Record({
    id: IDL.Text,
    feed_type: FeedType,
    status: FeedStatus,
    decimals: IDL.Opt(IDL.Nat64),
    owner: IDL.Text,
    new_sources: IDL.Opt(IDL.Vec(Source)),
    data: IDL.Opt(AssetDataResult),
    update_freq: IDL.Nat64,
    sources: IDL.Opt(IDL.Vec(HttpSource)),
  });
  const GetFeedResponse = IDL.Variant({
    Ok: IDL.Opt(Feed),
    Err: IDL.Text,
  });
  const FeedTypeFilter = IDL.Variant({
    Default: IDL.Null,
    Custom: IDL.Null,
  });
  const GetFeedsFilter = IDL.Record({
    feed_type: IDL.Opt(FeedTypeFilter),
    owner: IDL.Opt(IDL.Text),
    search: IDL.Opt(IDL.Text),
  });
  const Pagination = IDL.Record({ page: IDL.Nat64, size: IDL.Nat64 });
  const GetFeedsResultWithPagination = IDL.Record({
    page: IDL.Nat64,
    total_pages: IDL.Nat64,
    size: IDL.Nat64,
    total_items: IDL.Nat64,
    items: IDL.Vec(Feed),
  });
  const GetFeedsResponse = IDL.Variant({
    Ok: GetFeedsResultWithPagination,
    Err: IDL.Text,
  });
  const MultipleAssetsDataResult = IDL.Record({
    signature: IDL.Opt(IDL.Text),
    data: IDL.Vec(AssetData),
  });
  const GetMultipleAssetsDataResponse = IDL.Variant({
    Ok: MultipleAssetsDataResult,
    Err: IDL.Text,
  });
  const GetWhitelistResponse = IDL.Variant({
    Ok: IDL.Vec(IDL.Text),
    Err: IDL.Text,
  });
  const BoolResponse = IDL.Variant({ Ok: IDL.Bool, Err: IDL.Text });
  const UpdateCfg = IDL.Record({
    fallback_xrc: IDL.Opt(IDL.Principal),
    mock: IDL.Opt(IDL.Bool),
    rpc_wrapper: IDL.Opt(IDL.Text),
    exchange_rate_canister: IDL.Opt(IDL.Principal),
    balances_cfg: IDL.Opt(BalancesCfg),
    key_name: IDL.Opt(IDL.Text),
    evm_rpc_canister: IDL.Opt(IDL.Principal),
  });
  return IDL.Service({
    add_to_balances_whitelist: IDL.Func([IDL.Vec(IDL.Text)], [Error], []),
    add_to_whitelist: IDL.Func([IDL.Text], [Error], []),
    clear_state: IDL.Func([], [Error], []),
    create_custom_feed: IDL.Func([CreateCustomFeedRequest], [Error], []),
    create_default_feed: IDL.Func([CreateDefaultFeedRequest], [Error], []),
    deposit: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Error], []),
    eth_address: IDL.Func([], [TextResponse], []),
    get_asset_data: IDL.Func(
      [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
      [GetAssetDataResponse],
      []
    ),
    get_asset_data_with_proof: IDL.Func(
      [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
      [GetAssetDataWithProofResponse],
      []
    ),
    get_balance: IDL.Func([IDL.Text], [NatResponse], []),
    get_cfg: IDL.Func([], [GetCfgResponse], []),
    get_feed: IDL.Func([IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)], [GetFeedResponse], []),
    get_feeds: IDL.Func(
      [IDL.Opt(GetFeedsFilter), IDL.Opt(Pagination), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
      [GetFeedsResponse],
      []
    ),
    get_multiple_assets_data: IDL.Func(
      [IDL.Vec(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
      [GetMultipleAssetsDataResponse],
      []
    ),
    get_multiple_assets_data_with_proof: IDL.Func(
      [IDL.Vec(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
      [GetMultipleAssetsDataResponse],
      []
    ),
    get_whitelist: IDL.Func([], [GetWhitelistResponse], []),
    is_feed_exists: IDL.Func([IDL.Text], [IDL.Bool], []),
    is_whitelisted: IDL.Func([IDL.Text], [BoolResponse], []),
    remove_custom_feed: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Error], []),
    remove_default_feed: IDL.Func([IDL.Text], [Error], []),
    remove_from_whitelist: IDL.Func([IDL.Text], [Error], []),
    sign_message: IDL.Func([IDL.Text], [TextResponse], []),
    update_cfg: IDL.Func([UpdateCfg], [Error], []),
    withdraw: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [TextResponse], []),
    withdraw_fees: IDL.Func([IDL.Text], [TextResponse], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
