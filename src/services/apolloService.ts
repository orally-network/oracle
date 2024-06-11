import { Contract, providers, utils } from 'ethers';
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Address } from 'viem';

import apolloCanister from 'Canisters/apolloCanister';
import logger from 'Utils/logger';
import { CHAINS_MAP } from 'Constants/chains';
import { AllowedChain } from 'Interfaces/common';
import { nativeEthToken } from 'Constants/tokens';
import { remove0x } from 'Utils/addressUtils';
import { useGlobalState } from 'Providers/GlobalState';
import { GeneralResponse } from 'Interfaces/common';

import { okOrErrResponseWrapper, toastWrapper } from './utils';

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
export const EVENT_NAME_DATA_FEED_REQUESTED = 'DataFeedRequested';
export const EVENT_NAME_RANDOM_FEED_REQUESTED = 'RandomFeedRequested';
const APOLLO_COORDINATOR_CONTRACT_EVENTS_ABI = [
  `event ${EVENT_NAME_DATA_FEED_REQUESTED}(uint256 indexed requestId, string dataFeedId, uint256 callbackGasLimit, address indexed requester);`,
  `event ${EVENT_NAME_RANDOM_FEED_REQUESTED}(uint256 indexed requestId, uint256 callbackGasLimit, uint256 numWords, address indexed requester);`
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
  enabled: Boolean(chainId && provider && coordinatorAddress),
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

// query balance (with chainId)
// query
const APOLLO_BALANCE_QUERY_KEY = 'balance';
export const useFetchApolloBalance = (chainId: number) => {
  const { addressData } = useGlobalState();

  return useQuery({
    queryKey: [APOLLO_BALANCE_QUERY_KEY, chainId, addressData.address],
    queryFn: async () => {
      try {
        const promise = apolloCanister.get_balance(chainId, addressData.address) as Promise<GeneralResponse>;
        const wrappedPromise = okOrErrResponseWrapper(promise);

        const res = await wrappedPromise;

        logger.log('[service][apollo] queried apollo balance', { res });

        return res;
      } catch (error) {
        logger.error('[service][apollo] Failed to query apollo balance', error);
      }

      return;
    },
    enabled: Boolean(chainId && addressData.address),
  });
}

// mutate
export const useDeposit = () => {
  const { addressData } = useGlobalState();
  const queryClient = useQueryClient();

  return useMutation({
    // @ts-ignore
    mutationFn: async ({ chainId, tx_hash }: { chainId: number, tx_hash: Hash }) => {
      const promise = apolloCanister.deposit(
        chainId,
        tx_hash,
        [], // allowance
        addressData.message,
        remove0x(addressData.signature)
      ) as Promise<GeneralResponse>;
      const wrappedPromise = okOrErrResponseWrapper(promise);

      // todo[1]: add logic for saving tx_hash to local storage for future checks if user close window, but deposit wasn't successful - to retry it

      const res = await toastWrapper(wrappedPromise, 'Deposit');

      logger.log('[service][apollo] deposited', { res });

      return { res, tx_hash, chainId };
    },
    onError: (error: any, variables: any, context: any) => {
      logger.error(`[service][apollo] Failed to deposit`, error, variables, context);
    },
    onSuccess: ({ chainId }) => {
      // todo[1]: clear localstorage here

      queryClient.invalidateQueries({ queryKey: [APOLLO_BALANCE_QUERY_KEY, chainId, addressData.address] });
    },
  });
};

// add allowance (spender)
// mutate
export const useGrantAllowance = () => {
  const { addressData } = useGlobalState();

  return useMutation({
    // @ts-ignore
    mutationFn: async ({ chainId, spender }: { chainId: number, spender: Address }) => {
      const promise = apolloCanister.grant(
        chainId,
        spender,
        addressData.message,
        remove0x(addressData.signature)
      ) as Promise<GeneralResponse>;
      const wrappedPromise = okOrErrResponseWrapper(promise);

      const res = await toastWrapper(wrappedPromise, 'Grant allowance');

      logger.log('[service][apollo] spender added', { res });

      return res;
    },
    onError: (error: any, variables: any, context: any) => {
      logger.error(`[service][apollo] Failed to add spender`, error, variables, context);
    },
  });
};
