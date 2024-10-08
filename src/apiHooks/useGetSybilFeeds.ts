import { SybilFilters, RemoteDataType } from 'Interfaces/common';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { dynamicQueryKeys } from '../dynamicQueryKeys.ts';
import sybilCanister from 'Canisters/sybilCanister';
import { Feed } from 'Interfaces/feed';
import { DEFAULT_FEEDS_SIZE } from 'Constants/ui';

interface useGetSybilFeedsProps {
  page?: number;
  size?: number;
  filters?: SybilFilters | [];
  isGetAll?: boolean;
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
  Ok: {
    items: Feed[];
    page: number;
    size: number;
    total_items: number;
    total_pages: number;
  };
}

export const useGetSybilFeeds = ({
  page,
  size,
  filters,
  isGetAll,
}: useGetSybilFeedsProps): useGetSybilFeedsResult => {
  const queryClient: QueryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: [dynamicQueryKeys.subscriptions(), filters, page, size],
    queryFn: async () => {
      const feedsResponse: GetFeedsResponse = await sybilCanister.get_feeds(
        isGetAll ? [] : [filters],
        isGetAll
          ? []
          : [
              {
                page,
                size: size || DEFAULT_FEEDS_SIZE,
              },
            ],
        [], //TODO: add msg and sig
        [],
      );

      feedsResponse.Ok.items.forEach((feed: Feed) => {
        queryClient.setQueryDefaults(feed.id.toString(), {
          cacheTime: Infinity,
          staleTime: Infinity,
        });

        queryClient.setQueryData(feed.id.toString(), feed);
      });

      console.log({ ok: feedsResponse.Ok });

      return {
        meta: {
          page: feedsResponse.Ok.page,
          size: feedsResponse.Ok.size,
          totalItems: feedsResponse.Ok.total_items,
          totalPages: feedsResponse.Ok.total_pages,
        },
        items: feedsResponse.Ok.items,
      };
    },
    staleTime: 30 * 1000,
    keepPreviousData: true,
  });

  const refetch = async (): Promise<void> => {
    await refetchQuery();
  };

  const feeds: Feed[] = data?.items ?? [];
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
