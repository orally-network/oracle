import { RemoteDataType } from 'Interfaces/common';
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import { dynamicQueryKeys } from '../dynamicQueryKeys';
import apolloCanister from 'Canisters/apolloCanister';
import { ApolloInstance } from 'Interfaces/apollo';
import { DEFAULT_APOLLO_ITEMS_SIZE } from 'Constants/ui';

type useGetApolloItemsProps = {
  page?: number;
  size?: number;
  isGetAll?: boolean;
};

interface useGetApolloItemsResult {
  data: {
    type: RemoteDataType;
    items?: ApolloInstance[];
    meta?: {
      page: number;
      size: number;
      totalItems: number;
      totalPages: number;
    };
  };
  refetch: () => Promise<void>;
}

interface GetApolloDataResponse {
  items: ApolloInstance[];
  page: number;
  size: number;
  total_items: number;
  total_pages: number;
}

export const useGetApolloItems = ({
  page,
  size,
  isGetAll,
}: useGetApolloItemsProps): useGetApolloItemsResult => {
  const queryClient: QueryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    refetch: refetchQuery,
  } = useQuery(
    [dynamicQueryKeys.apollo(), page, size],
    async () => {
      const apolloResponse: GetApolloDataResponse = await apolloCanister.get_apollo_instances(
        isGetAll
          ? []
          : [
              {
                page,
                size: size || DEFAULT_APOLLO_ITEMS_SIZE,
              },
            ]
      );

      console.log(apolloResponse, 'apolloInstances');

      apolloResponse.items.forEach((item: ApolloInstance) => {
        queryClient.setQueryDefaults(item.apollo_instance.canister_id.toString(), {
          cacheTime: Infinity,
          staleTime: Infinity,
        });

        queryClient.setQueryData(item.apollo_instance.canister_id.toString(), item);
      });

      return {
        meta: {
          page: apolloResponse.page,
          size: apolloResponse.size,
          totalItems: apolloResponse.total_items,
          totalPages: apolloResponse.total_pages,
        },
        items: apolloResponse.items,
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

  const feeds: ApolloInstance[] = data?.items ?? [];
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
