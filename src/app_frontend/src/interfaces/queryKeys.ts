import { EnsuredQueryKey } from 'react-query';

export enum QueryType {
  Subscriptions = 'subscriptions',
}

export type EnsuredDynamicQueryKey<Types extends unknown[] = []> = EnsuredQueryKey<
  [QueryType, ...Types]
>;

export interface QueryKeys {
  subscriptions: () => EnsuredDynamicQueryKey;
}
