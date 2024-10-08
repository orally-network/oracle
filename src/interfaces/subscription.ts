export interface Subscription {
  status: SubscriptionStatus;
  method: SubscriptionMethod;
  owner: string;
  contract_addr: string;
  frequency: any;
  id: bigint;
  label: string;
}

interface SubscriptionStatus {
  is_active: boolean;
  last_update: string;
  executions_counter: number;
  failures_counter: [];
}

interface ExecutionCondition {
  PriceMutation: {
    mutation_rate: number;
    creation_price: number;
    price_mutation_type: PriceMutationType;
    feed_id: string;
  };
  Frequency: bigint;
}

interface PriceMutationType {
  Decrease: boolean;
  Both: boolean;
  Increase: boolean;
}

interface SubscriptionMethod {
  abi: string;
  chain_id: bigint | number;
  name: string;
  gas_limit: bigint;
  exec_condition: ExecutionCondition[];
  method_type: {
    Feed: string;
    Random: boolean;
  };
}

export type FrequencyType = {
  value: number | null;
  units: Unit;
};

export type FilterType = 'Empty' | 'Feed' | 'Random';

export type OptionType = {
  value: string;
  label: string;
};

export type Unit = 'min' | 'hour' | 'day' | 'week' | 'month';

export interface SubscriptionData extends Pagination {
  items: Subscription[];
}

export interface Pagination {
  page: number;
  total_pages: number;
  size: number;
  total_items: number;
}
