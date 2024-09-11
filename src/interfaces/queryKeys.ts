import { EnsuredQueryKey } from '@tanstack/react-query';
import { Filters } from './common';

export enum QueryType {
  Subscriptions = 'subscriptions',
  Feeds = 'feeds',
  FeedDataWithProof = 'feedDataWithProof',
}

export type EnsuredDynamicQueryKey<Types extends unknown[] = []> = EnsuredQueryKey<
  [QueryType, ...Types]
>;

// TODO: add chains to query keys
export interface QueryKeys {
  subscriptions: (
    filters?: Filters,
    page?: number,
    size?: number,
  ) => EnsuredDynamicQueryKey<[Filters | undefined, number | undefined, number | undefined]>;
  feeds: (
    filters?: Filters,
    page?: number,
    size?: number,
  ) => EnsuredDynamicQueryKey<[Filters | undefined, number | undefined, number | undefined]>;
  feedDataWithProof: (id: string) => EnsuredDynamicQueryKey<[string]>;
}
