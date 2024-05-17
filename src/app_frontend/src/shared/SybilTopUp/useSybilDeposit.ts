import { Address, erc20ABI, waitForTransaction, writeContract } from '@wagmi/core';
import { utils } from 'ethers';
import { fetchBalance, useSybilBalanceStore, deposit } from 'Stores/useSybilBalanceStore';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { BALANCE_USD_DECIMALS } from 'Utils/balance';
import logger from 'Utils/logger';
import { TOKENS_MAP } from 'Constants/tokens';
import { useGlobalState } from 'Providers/GlobalState';

interface UseSybilDepositParams {
  setIsModalVisible: (val: boolean) => void;
}

export const useSybilDeposit = ({ setIsModalVisible }: UseSybilDepositParams) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const sybilEthAddress = useSybilBalanceStore((state) => state.sybilEthAddress);
  const { addressData } = useGlobalState();

  const makeDepositTransfer = useCallback(async (chainId: number, tokenAddress: Address, amount: number) => {
    return writeContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'transfer',
      // @ts-ignore
      args: [sybilEthAddress, utils.parseUnits(String(amount || 0), BALANCE_USD_DECIMALS)],
      chainId,
    });
  }, [sybilEthAddress]);

  const sybilDeposit = useCallback(async (chainId: number, tokenAddress: Address, amount: number) => {
    setIsConfirming(true);
    try {
      const token = TOKENS_MAP[tokenAddress];
      const { hash } = await makeDepositTransfer(chainId, tokenAddress, amount);
      console.log({ hash });

      setIsModalVisible(false);

      const data = await toast.promise(
        waitForTransaction({
          hash,
        }),
        {
          pending: `Sending ${amount} ${token.symbol} to ${sybilEthAddress}`,
          success: `Sent successfully`,
          error: {
            render({ data }) {
              logger.error(`Sending ${token.symbol}`, data);

              return 'Something went wrong. Try again later.';
            },
          },
        }
      );

      console.log({ data, hash });

      await toast.promise(deposit(hash, addressData), {
        pending: `Deposit ${amount} ${token.symbol} to canister`,
        success: `Deposited successfully`,
        error: {
          render({ data }) {
            logger.error(`Depositing ${token.symbol}`, data);

            return 'Deposit failed. Try again later.';
          },
        },
      });

      await fetchBalance(addressData);
    } catch (error) {
      console.log({ error });
      toast.error('Something went wrong. Try again later.');
    } finally {
      setIsConfirming(false);
    }
  }, [setIsModalVisible, makeDepositTransfer, fetchBalance, addressData, sybilEthAddress]);

  return {
    isConfirming,
    sybilDeposit,
  };
}
