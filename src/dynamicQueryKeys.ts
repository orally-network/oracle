import { QueryKeys, QueryType } from 'Interfaces/queryKeys';

export const dynamicQueryKeys: QueryKeys = {
  subscriptions: (filters, page, size) => [QueryType.Subscriptions, filters, page, size],
  feeds: (filters, page, size) => [QueryType.Feeds, filters, page, size],
  feedDataWithProof: (id) => [QueryType.FeedDataWithProof, id],
};
