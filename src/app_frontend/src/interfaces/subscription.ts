export interface Subscription {
  status: SubscriptionStatus;
  method: SubscriptionMethod;
  owner: string;
  contract_addr: string;
  frequency: any;
  id: BigInt;
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
    pair_id: string;
  };
  Frequency: BigInt;
}

interface PriceMutationType {
  Decrease: boolean;
  Both: boolean;
  Increase: boolean;
}

interface SubscriptionMethod {
  abi: string;
  chain_id: BigInt | number;
  name: string;
  gas_limit: BigInt;
  exec_condition: ExecutionCondition[];
  method_type: {
    Pair: string;
    Random: boolean;
  };
}

export type FrequencyType = {
  value: number | null;
  units: Unit;
};

export type FilterType = 'all' | 'price' | 'random';

export type OptionType = {
  value: string;
  label: string;
};

export type Unit = 'min' | 'hour' | 'day' | 'week' | 'month';
