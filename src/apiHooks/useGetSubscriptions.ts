import { Filters, RemoteDataType } from 'Interfaces/common';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { dynamicQueryKeys } from '../dynamicQueryKeys.ts';
import { Subscription } from 'Interfaces/subscription';
import pythiaCanister from 'Canisters/pythiaCanister';
import { DEFAULT_SUBSCRIPTIONS_SIZE } from 'Constants/ui';

interface UseGetSubscriptionsProps {
  page?: number;
  size?: number;
  filters?: Filters;
  isGetAll?: boolean;
}

interface UseGetSubscriptionsResult {
  data: {
    type: RemoteDataType;
    items?: Subscription[];
    meta?: {
      page: number;
      size: number;
      totalItems: number;
      totalPages: number;
    };
  };
  refetch: () => Promise<void>;
}

interface GetSubscriptionsResponse {
  items: Subscription[];
  page: number;
  size: number;
  total_items: number;
  total_pages: number;
}

export const useGetSubscriptions = ({
  page,
  size,
  filters,
  isGetAll,
}: UseGetSubscriptionsProps): UseGetSubscriptionsResult => {
  const queryClient: QueryClient = useQueryClient();

  const normalizedFilters = filters
    ? {
        ...filters,
        chain_ids: filters.chain_ids.length
          ? [filters.chain_ids.map((value: string) => BigInt(value))]
          : [],
      }
    : [];

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
      const subscriptionsResponse: GetSubscriptionsResponse =
        await pythiaCanister.get_subscriptions(
          isGetAll ? [] : [normalizedFilters],
          isGetAll
            ? []
            : [
                {
                  page,
                  size: size || DEFAULT_SUBSCRIPTIONS_SIZE,
                },
              ],
        );

      subscriptionsResponse.items.forEach((subscription: Subscription) => {
        queryClient.setQueryDefaults(subscription.id.toString(), {
          cacheTime: Infinity,
          staleTime: Infinity,
        });

        queryClient.setQueryData(subscription.id.toString(), subscription);
      });

      return {
        meta: {
          page: subscriptionsResponse.page,
          size: subscriptionsResponse.size,
          totalItems: subscriptionsResponse.total_items,
          totalPages: subscriptionsResponse.total_pages,
        },
        items: subscriptionsResponse.items,
      };
    },
    {
      staleTime: 30 * 1000,
      keepPreviousData: true,
    },
  );

  const refetch = async (): Promise<void> => {
    await refetchQuery();
  };

  const subscriptions: Subscription[] = data?.items ?? [];
  console.log({ subscriptions });

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

  if (isSuccess && subscriptions.length === 0) {
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
        items: subscriptions,
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
