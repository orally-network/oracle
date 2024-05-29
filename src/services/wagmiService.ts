import { useCallback, useState } from 'react';
import { Address, erc20Abi, formatUnits } from 'viem';
import { useConfig, useReadContracts, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';

import logger from 'Utils/logger';

import { toastWrapper } from './utils';

interface UseTokenBalanceProps {
  tokenAddress: Address;
  address: Address;
  enabled: boolean;
  chainId: number;
}

export const useTokenBalance = ({ tokenAddress, address, enabled, chainId }: UseTokenBalanceProps) => {
  const { data: [balance, decimals, symbol] = [], ...rest } = useReadContracts({
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
      enabled,
    },
  });

  return {
    balance: balance && decimals && symbol ? {
      value: balance,
      formatted: formatUnits(balance, decimals),
      decimals,
      symbol,
    } : null,
    ...rest,
  }
};

export const useWriteContractWithWait = (notifyPrefix?: string) => {
  const [isPending, setIsPending] = useState(false);

  const config = useConfig();
  const { writeContractAsync, ...rest } = useWriteContract();

  const writeContractWithWait = useCallback(async (params: any) => {
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
  }, [config]);

  return {
    ...rest,
    isPending,
    writeContractWithWait,
  };
}
