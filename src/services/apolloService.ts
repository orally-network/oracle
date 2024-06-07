import { Contract, providers, utils } from 'ethers';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import apolloCanister from 'Canisters/apolloCanister';
import logger from 'Utils/logger';
import { CHAINS_MAP } from 'Constants/chains';
import { AllowedChain } from 'Interfaces/common';
import { nativeEthToken } from 'Constants/tokens';

// useQuery/useMutation + apollo request + toast

export type ApolloInstance = AllowedChain & {
  canisterId: string;
  isActive: boolean;
  evmAddress: string;
  apolloCoordinator: string;
};

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
        symbol: CHAINS_MAP[apolloInstance.chain_id].nativeCurrency.symbol,
        tokens: [nativeEthToken],
        canisterId: apolloInstance.apollo_instance.canister_id.toString(),
        isActive: apolloInstance.apollo_instance.is_active,
        evmAddress: apolloInstance.apollo_instance.apollo_main_address,
        apolloCoordinator: apolloInstance.apollo_instance.apollo_coordinator,
      }));

      logger.log('[service][apollo] queried apollo instances', { res, apolloInstances });

      return apolloInstances;
    } catch (error) {
      logger.error('[service][apollo] Failed to query apollo instances', error);
    }

    return;
  },
});

// query
const APOLLO_COORDINATOR_LOGS_QUERY_KEY = 'apolloCoordinatorLogs';
const APOLLO_COORDINATOR_CONTRACT_EVENTS_ABI = [
  'event DataFeedRequested(uint256 indexed requestId, string dataFeedId, uint256 callbackGasLimit, address indexed requester);',
  'event RandomFeedRequested(uint256 indexed requestId, uint256 callbackGasLimit, uint256 numWords, address indexed requester);'
];
export const useGetApolloCoordinatorLogs = (chainId: number, provider: providers.BaseProvider, coordinatorAddress: string) => useQuery({
  queryKey: [APOLLO_COORDINATOR_LOGS_QUERY_KEY, chainId, coordinatorAddress],
  queryFn: async () => {
    try {
      const logs = await provider.getLogs({
        address: coordinatorAddress,
        topics: [
          [
            utils.id('RandomFeedRequested(uint256,uint256,uint256,address)'),
            utils.id('DataFeedRequested(uint256,string,uint256,address)'),
          ],
        ],
        fromBlock: CHAINS_MAP[chainId].fromBlock ?? 'earliest',
        toBlock: 'latest'
      });

      logger.log('[service][apollo] queried apollo coordinator logs', { logs, chainId });

      return logs;
    } catch (error) {
      logger.error('[service][apollo] Failed to query apollo coordinator logs', error);
    }

    return;
  },
});
// logs parser
export const useGetParsedApolloCoordinatorLogs = (chainId: number, coordinatorAddress: string, onlyLast: boolean = true) => {
  try {
    const rpc = CHAINS_MAP[chainId].rpcUrls.default.http[0];
    const provider = new providers.JsonRpcProvider(rpc);

    const { data, ...rest } = useGetApolloCoordinatorLogs(chainId, provider, coordinatorAddress);

    const parsedLogs = useMemo(() => {
      if (!data) return;

      const contract = new Contract(
        coordinatorAddress,
        APOLLO_COORDINATOR_CONTRACT_EVENTS_ABI,
        provider
      );

      const logs = [];

      if (data.length >= 1 && onlyLast) {
        logs.push(contract.interface.parseLog(data[data.length - 1]));
      } else {
        data.forEach((log: any) => {
          logs.push(contract.interface.parseLog(log));
        });
      }

      logger.log('[service][apollo] parsed apollo coordinator logs', { logs, chainId });

      return logs;
    }, [data, coordinatorAddress, onlyLast]);

    return {
      data: parsedLogs,
      ...rest,
    };
  } catch (error) {
    logger.error('[service][apollo] Failed to parse apollo coordinator logs', error);
    return { data: null, isLoading: false };
  }
};
