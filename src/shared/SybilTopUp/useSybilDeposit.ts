import { erc20Abi, parseUnits } from 'viem';
import { useCallback } from 'react';

import { useFetchSybilTreasureAddress, useDeposit, AllowedToken } from 'Services/sybilService';
import { useWriteContractWithWait } from 'Services/wagmiService';

interface UseSybilDepositParams {
  setIsModalVisible: (val: boolean) => void;
}

export const useSybilDeposit = ({ setIsModalVisible }: UseSybilDepositParams) => {
  const { data: treasureAddress } = useFetchSybilTreasureAddress();

  const { writeContractWithWait, isPending: isTransferring } = useWriteContractWithWait('Transferring funds to Sybil');
  const { mutate: deposit, isPending: isDepositing } = useDeposit();

  const sybilDeposit = useCallback(async (chainId: number, token: AllowedToken, amount: number) => {
    setIsModalVisible(false);

    // todo: handle if token is eth, so make another deposit transfer
    const hash = await writeContractWithWait({
      address: token.address,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [treasureAddress, parseUnits(String(amount || 0), Number(token.decimals))],
      chainId,
    });

    if (hash) {
      deposit({
        chainId,
        tx_hash: hash,
      });
    }
  }, [setIsModalVisible, treasureAddress]);

  return {
    isDepositing: isDepositing || isTransferring,
    sybilDeposit,
  };
}
