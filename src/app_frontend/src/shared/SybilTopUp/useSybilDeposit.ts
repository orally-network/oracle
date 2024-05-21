import { erc20ABI, waitForTransaction, writeContract } from '@wagmi/core';
import { utils } from 'ethers';
import { fetchBalance, useSybilBalanceStore, deposit, AllowedToken } from 'Stores/useSybilBalanceStore';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import logger from 'Utils/logger';
import { useGlobalState } from 'Providers/GlobalState';

interface UseSybilDepositParams {
  setIsModalVisible: (val: boolean) => void;
}

export const useSybilDeposit = ({ setIsModalVisible }: UseSybilDepositParams) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const sybilTreasureAddress = useSybilBalanceStore((state) => state.sybilTreasureAddress);
  const { addressData } = useGlobalState();

  // todo: handle if token is eth, so make another deposit transfer
  const makeDepositTransfer = useCallback(async (chainId: number, token: AllowedToken, amount: number) => {
    return writeContract({
      address: token.address,
      abi: erc20ABI,
      functionName: 'transfer',
      // @ts-ignore
      args: [sybilTreasureAddress, utils.parseUnits(String(amount || 0), token.decimals)],
      chainId,
    });
  }, [sybilTreasureAddress]);

  const sybilDeposit = useCallback(async (chainId: number, token: AllowedToken, amount: number) => {
    setIsConfirming(true);
    try {
      const { hash } = await makeDepositTransfer(chainId, token, amount);
      console.log({ hash });

      setIsModalVisible(false);

      const data = await toast.promise(
        waitForTransaction({
          hash,
        }),
        {
          pending: `Sending ${amount} ${token.symbol} to ${sybilTreasureAddress}`,
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

      await toast.promise(deposit(chainId, hash, addressData), {
        pending: `Deposit ${amount} ${token.symbol} to canister`,
        success: `Deposited successfully`,
        error: {
          render({ data }) {
            logger.error(`Depositing ${token.symbol}`, data);

            return 'Deposit failed. Try again later.';
          },
        },
      });

      await fetchBalance(addressData.address);
    } catch (error) {
      console.log({ error });
      toast.error('Something went wrong. Try again later.');
    } finally {
      setIsConfirming(false);
    }
  }, [setIsModalVisible, makeDepositTransfer, fetchBalance, addressData, sybilTreasureAddress]);

  return {
    isConfirming,
    sybilDeposit,
  };
}
