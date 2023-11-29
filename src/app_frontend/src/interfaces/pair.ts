export interface Pair {
  id: string;
  status: PairStatus;
  decimals: number;
  owner: string;
  data: string | string[];
  update_freq: number;
  pair_type: PairType;
}

export interface PairStatus {
  requests_counter: number;
  updated_counter: number;
  last_update: number;
}

export interface PairType {
  Default: any;
  Custom: any;
}
