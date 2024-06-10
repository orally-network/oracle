import { useCallback, useState } from 'react';
import { Address, erc20Abi, formatUnits } from 'viem';
import { useConfig, useReadContracts, useWriteContract, useSendTransaction, useBalance } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { nativeEthToken } from 'Constants/tokens';

import logger from 'Utils/logger';

import { toastWrapper } from './utils';

interface UseTokenBalanceProps {
  tokenAddress: Address;
  address: Address;
  enabled: boolean;
  chainId: number;
}

export const useTokenBalance = ({ tokenAddress, address, enabled, chainId }: UseTokenBalanceProps) => {
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

export const useSendTransactionWithWait = (notifyPrefix?: string) => {
  const [isPending, setIsPending] = useState(false);

  const config = useConfig();
  const { sendTransactionAsync, ...rest } = useSendTransaction();

  const sendTransactionWithWait = useCallback(async (params: any) => {
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
  }, [config]);

  return {
    ...rest,
    isPending,
    sendTransactionWithWait,
  };
}
