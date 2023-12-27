import { QueryKeys, QueryType } from 'Interfaces/queryKeys';

export const dynamicQueryKeys: QueryKeys = {
  subscriptions: () => [QueryType.Subscriptions],
};
