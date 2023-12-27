import { Filters, RemoteDataType } from 'Interfaces/common';
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import { dynamicQueryKeys } from '../dynamicQueryKeys';
import sybilCanister from 'Canisters/sybilCanister';
import { Feed } from 'Interfaces/feed';

interface useGetSybilFeedsProps {
  page?: number;
  size?: number;
  filters?: Filters;
}

interface useGetSybilFeedsResult {
  data: {
    type: RemoteDataType;
    items?: Feed[];
    meta?: {
      page: number;
      size: number;
      totalItems: number;
      totalPages: number;
    };
  };
  refetch: () => Promise<void>;
}

interface GetFeedsResponse {
  items: Feed[];
  page: number;
  size: number;
  total_items: number;
  total_pages: number;
}

export const useGetSybilFeeds = ({
  page,
  size,
  filters,
}: useGetSybilFeedsProps): useGetSybilFeedsResult => {
  const queryClient: QueryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    refetch: refetchQuery,
  } = useQuery(
    [dynamicQueryKeys.subscriptions(), filters, page, size],
    async () => {
      const feedsResponse: Feed[] = await sybilCanister.get_pairs();

      feedsResponse.forEach((feed: Feed) => {
        queryClient.setQueryDefaults(feed.id.toString(), {
          cacheTime: Infinity,
          staleTime: Infinity,
        });

        queryClient.setQueryData(feed.id.toString(), feed);
      });

      return {
        // TODO: update after BE pagination is ready
        meta: {
          page: 1,
          size: 10,
          totalItems: 10,
          totalPages: 1,
        },
        items: feedsResponse,
      };
    },
    {
      staleTime: 30 * 1000,
      keepPreviousData: true,
    }
  );

  const refetch = async (): Promise<void> => {
    await refetchQuery();
  };

  const feeds: Feed[] = data?.items ?? data;
  console.log({ feeds });

  if (isError) {
    return {
      data: {
        type: RemoteDataType.ERROR,
      },
      refetch,
    };
  }

  if (isLoading || isFetching) {
    return {
      data: {
        type: RemoteDataType.LOADING,
      },
      refetch,
    };
  }

  if (isSuccess && feeds.length === 0) {
    return {
      data: {
        type: RemoteDataType.EMPTY,
      },
      refetch,
    };
  }

  if (isSuccess) {
    return {
      data: {
        type: RemoteDataType.SUCCESS,
        items: feeds,
        meta: data.meta,
      },
      refetch,
    };
  }

  return {
    data: { type: RemoteDataType.NONE },
    refetch,
  };
};
