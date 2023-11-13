

export interface Subscription {
  status: SubscriptionStatus;
  method: SubscriptionMethod;
  owner: string;
  contract_addr: string;
  frequency: any;
  id: string;
}

interface SubscriptionStatus {
  is_active: boolean;
  last_update: string;
  executions_counter: number;
}

interface SubscriptionMethod {
  chain_id: string;
  name: string;
  gas_limit: number;
  method_type: {
    pair: string,
    random: boolean,
  }
}

export type FilterType = 'all' | 'price' | 'random'

export type OptionType = {
  value: string;
  label: string;
};

export type Unit = 'min' | 'hour'| 'day' | 'week' | 'month';