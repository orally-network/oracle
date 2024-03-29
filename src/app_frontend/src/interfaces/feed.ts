export interface Feed {
  id: string;
  status: FeedStatus;
  decimals?: number[];
  owner: string;
  data: [FeedData[]];
  update_freq: number;
  feed_type: FeedType;
  sources: Source[];
}

export type ApiKey = {
  title: string;
  key: string;
};

export interface Source {
  uri: string;
  resolver: string;
  expected_bytes: number[];
  api_keys: ApiKey[];
}

export interface FeedRequest extends Omit<Feed, 'owner' | 'data' | 'status'> {
  msg: string;
  sig: string;
}

export interface FeedStatus {
  requests_counter: number;
  updated_counter: number;
  last_update: number;
}

export type FeedType = { Default: null } | { Custom: null };

export type FilterFeedType = 'Default' | 'Custom' | 'All';

export interface FeedData {
  decimals: number; // bigint
  rate: number; // bigint
  signature: [string]; // []
  symbol: string; // BTC/USD
  timestamp: number; // bigint
}

export type SignatureData = {
  pairId: string;
  price: number;
  decimals: number;
  timestamp: number;
  signature: string;
};

export type VerifyData = {
  data: {
    DefaultPriceFeed?: {
      rate: number;
      decimals: number;
      timestamp: number;
    };
    CustomPriceFeed?: {
      rate: number;
      decimals: number;
      timestamp: number;
    };
  };
  signature: string;
};
