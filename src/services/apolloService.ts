import { useQuery } from '@tanstack/react-query';

import apolloCanister from 'Canisters/apolloCanister';
import logger from 'Utils/logger';

// useQuery/useMutation + apollo request + toast

interface ApolloInstance {
  chainId: string;
  canisterId: string;
  isActive: boolean;
  evmAddress: string;
  apolloCoordinator: string;
}

// query
const APOLLO_INSTANCES_QUERY_KEY = 'apolloInstances';
export const useFetchApolloInstances = () => useQuery({
  queryKey: [APOLLO_INSTANCES_QUERY_KEY],
  queryFn: async () => {
    try {
      const res: any = await apolloCanister.get_apollo_instances([{
        page: 1,
        size: 100,
      }]);

      // formatter
      const apolloInstances: ApolloInstance[] = res.items.map((apolloInstance: any) => ({
        chainId: apolloInstance.chain_id,
        canisterId: apolloInstance.apollo_instance.canister_id.toString(),
        isActive: apolloInstance.apollo_instance.is_active,
        evmAddress: apolloInstance.apollo_instance.apollo_main_address,
        // mock for zircuit
        apolloCoordinator: '0x45f61bAD7e29a6FB9ec307daD7B895e63Db1940B',
      }));

      logger.log('[service][apollo] queried apollo instances', { res, apolloInstances });

      return apolloInstances;
    } catch (error) {
      logger.error('[service][apollo] Failed to query apollo instances', error);
    }

    return;
  },
});
