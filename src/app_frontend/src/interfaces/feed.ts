export interface Feed {
  id: string;
  status: FeedStatus;
  decimals?: number[];
  owner: string;
  data: FeedData[];
  update_freq: number;
  feed_type: FeedType;
  sources: Source[];
}

export interface Source {
  uri: string;
  resolver: string;
  expected_bytes: number[];
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
  signature: string; // []
  symbol: string; // BTC/USD
  timestamp: number; // bigint
}
