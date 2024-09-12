import { Contract, providers, utils } from 'ethers';
import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type Address, erc20Abi, formatUnits } from 'viem';
import {
  useConfig,
  useReadContracts,
  useWriteContract,
  useSendTransaction,
  useBalance,
} from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';

import { CHAINS_MAP } from 'Constants/chains';
import { nativeEthToken } from 'Constants/tokens';
import logger from 'Utils/logger';
import OrallyMulticallABI from 'ABIs/OrallyMulticallAbi.json';
import APOLLO_COORDINATOR_CONTRACT_EVENTS_ABI from 'ABIs/ApolloCoordinatorEventsAbi';

import { toastWrapper, tryDecode } from './utils';

interface UseTokenBalanceProps {
  tokenAddress?: Address;
  address: Address;
  enabled: boolean;
  chainId: number;
}

export const useTokenBalance = ({
  tokenAddress,
  address,
  enabled,
  chainId,
}: UseTokenBalanceProps) => {
  const isNativeEth = tokenAddress === nativeEthToken.address;

  const { data: [tokenBalance, tokenDecimals, tokenSymbol] = [], ...tokenRest } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
        chainId,
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'decimals',
        chainId,
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'symbol',
        chainId,
      },
    ],
    query: {
      enabled: enabled && !isNativeEth,
    },
  });

  const { data: ethData, ...ethRest } = useBalance({
    address,
    chainId,
    query: {
      enabled: enabled && isNativeEth,
    },
  });

  const { balance, decimals, symbol, ...rest } = {
    balance: tokenBalance ?? ethData?.value,
    decimals: tokenDecimals ?? ethData?.decimals,
    symbol: tokenSymbol ?? ethData?.symbol,
    ...(tokenRest ?? ethRest),
  };

  return {
    balance:
      balance && decimals && symbol
        ? {
            value: balance,
            formatted: formatUnits(balance, decimals),
            decimals,
            symbol,
          }
        : null,
    ...rest,
  };
};

export const useWriteContractWithWait = (notifyPrefix?: string) => {
  const [isPending, setIsPending] = useState(false);

  const config = useConfig();
  const { writeContractAsync, ...rest } = useWriteContract();

  const writeContractWithWait = useCallback(
    async (params: any) => {
      setIsPending(true);

      try {
        const hash = await writeContractAsync(params);

        const res = await toastWrapper(waitForTransactionReceipt(config, { hash }), notifyPrefix);

        logger.log('[service][wagmi] useWriteContractWithWait(ed)', { res, hash });

        return hash;
      } catch (err) {
        logger.error('[service][wagmi] useWriteContractWithWait failed', err);
      } finally {
        setIsPending(false);
      }

      return;
    },
    [config],
  );

  return {
    ...rest,
    isPending,
    writeContractWithWait,
  };
};

export const useSendTransactionWithWait = (notifyPrefix?: string) => {
  const [isPending, setIsPending] = useState(false);

  const config = useConfig();
  const { sendTransactionAsync, ...rest } = useSendTransaction();

  const sendTransactionWithWait = useCallback(
    async (params: any) => {
      setIsPending(true);

      try {
        const hash = await sendTransactionAsync(params);

        const res = await toastWrapper(waitForTransactionReceipt(config, { hash }), notifyPrefix);

        logger.log('[service][wagmi] useSendTransactionWithWait(ed)', { res, hash });

        return hash;
      } catch (err) {
        logger.error('[service][wagmi] useSendTransactionWithWait failed', err);
      } finally {
        setIsPending(false);
      }

      return;
    },
    [config],
  );

  return {
    ...rest,
    isPending,
    sendTransactionWithWait,
  };
};

// query
const LOGS_QUERY_KEY = 'logs';
export const useGetLogs = (
  chainId: number,
  abi: any,
  address: Address,
  topics: string[],
  mapper?: (log: any) => any,
  filter?: (log: any) => any,
) =>
  useQuery({
    queryKey: [LOGS_QUERY_KEY, chainId, address],
    queryFn: async () => {
      try {
        const rpc = CHAINS_MAP[chainId].rpcUrls.default.http[0];
        const provider = new providers.JsonRpcProvider(rpc);

        const responseLogs = await provider.getLogs({
          address: address,
          topics: [topics],
          fromBlock: CHAINS_MAP[chainId].fromBlock ?? 'earliest',
          toBlock: 'latest',
        });

        const contract = new Contract(address, abi, provider);

        const parsedlogs = responseLogs.map((log: any) => ({
          ...contract.interface.parseLog(log),
          blockNumber: log.blockNumber,
        }));
        const filteredLogs = filter ? parsedlogs.filter(filter) : parsedlogs;
        const logs = mapper ? filteredLogs.map(mapper) : filteredLogs;

        // logger.log('[service][apollo] queried logs', { responseLogs, logs, chainId });

        return logs;
      } catch (error) {
        logger.error('[service][apollo] Failed to query logs', error);
      }

      return;
    },
    enabled: Boolean(chainId && abi && address && topics),
  });

export const useGetApolloCoordinatorLogs = (chainId: number, apolloCoordinatorAddress: Address) => {
  return useGetLogs(
    chainId,
    APOLLO_COORDINATOR_CONTRACT_EVENTS_ABI,
    apolloCoordinatorAddress,
    [
      utils.id('RandomFeedRequested(uint256,uint256,uint256,address)'),
      utils.id('DataFeedRequested(uint256,string,uint256,address)'),
    ],
    (log) => ({
      name: log.name,
      dataFeedId: log.args.dataFeedId,
      requestId: log.args.requestId.toNumber(),
      requester: log.args.requester,
      requestedBlockNumber: log.blockNumber,
    }),
  );
};

export const useGetMulticallLogs = (chainId: number, apolloEvmAddress: Address) => {
  const { data, ...rest } = useGetLogs(
    chainId,
    OrallyMulticallABI,
    CHAINS_MAP[chainId].multicallAddress,
    [
      // multicall log topics
      '0x16f7905379eee7e1a78c099c1e9945f56a281bebf0540efcf8ffc367a5136990',
      '0x000000000000000000000000a40a0617ba2b446b0300eed8b7d8a4c790216314',
    ],
    (log) => ({
      name: log.name,
      callsData: log.args.callsData.map((callData: any) => ({
        ...tryDecode(callData.callData),
        target: callData.target,
      })),
      sender: log.args.sender,
      fulfilledBlockNumber: log.blockNumber,
    }),
    (log: any) => log.args.sender.toLowerCase() === apolloEvmAddress.toLowerCase(),
  );

  return { data, ...rest };
};
