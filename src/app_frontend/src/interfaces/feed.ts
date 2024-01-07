export interface Feed {
  id: string;
  status: FeedStatus;
  decimals: number;
  owner: string;
  data: FeedData[];
  update_freq: number;
  feed_type: FeedType;
}

export interface FeedStatus {
  requests_counter: number;
  updated_counter: number;
  last_update: number;
}

export interface FeedType {
  Default: any;
  Custom: any;
}

export type FilterFeedType = 'Default' | 'Custom' | 'All';

export interface FeedData {
  decimals: number; // bigint
  rate: number; // bigint
  signature: string; // []
  symbol: string; // BTC/USD
  timestamp: number; // bigint
}
