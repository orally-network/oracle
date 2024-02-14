import { RemoteDataType } from 'Interfaces/common';
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import { dynamicQueryKeys } from '../dynamicQueryKeys';
import apolloCanister from 'Canisters/apolloCanister';
import { ApolloInstance } from 'Interfaces/apollo';

interface useGetApolloItemsProps {}

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

export const useGetApolloItems = (): useGetApolloItemsResult => {
  const queryClient: QueryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    refetch: refetchQuery,
  } = useQuery(
    [dynamicQueryKeys.apollo()],
    async () => {
      const apolloItems: ApolloInstance[] = await apolloCanister.get_apollo_instances();

      console.log(apolloItems, 'apolloInstances');

      apolloItems.forEach((item: ApolloInstance) => {
        queryClient.setQueryDefaults(item.apollo_instance.canister_id.toString(), {
          cacheTime: Infinity,
          staleTime: Infinity,
        });

        queryClient.setQueryData(item.apollo_instance.canister_id.toString(), item);
      });

      return {
        meta: {
          page: 1,
          size: 10,
          totalItems: 10,
          totalPages: 1,
        },
        items: apolloItems,
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
