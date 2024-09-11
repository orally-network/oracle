import { parseEther } from 'viem';
import { useCallback } from 'react';

import { useDeposit } from 'Services/apolloService';
import { useSendTransactionWithWait } from 'Services/wagmiService';
import { AllowedToken } from 'Interfaces/common';
import { type ApolloInstance } from 'Services/apolloService';

interface UseApolloDepositParams {
  closeModal: () => void;
  chain: ApolloInstance | null;
}

export const useApolloDeposit = ({ closeModal, chain }: UseApolloDepositParams) => {
  const { sendTransactionWithWait, isPending: isTransferring } = useSendTransactionWithWait(
    'Transferring funds to Apollo',
  );
  const { mutate: deposit, isPending: isDepositing } = useDeposit();

  const apolloDeposit = useCallback(
    async (chainId: number, _: AllowedToken, amount: number) => {
      if (!chain) return;

      closeModal();

      const hash = await sendTransactionWithWait({
        to: chain.evmAddress,
        value: parseEther(String(amount || 0)),
        chainId,
      });

      if (hash) {
        deposit({
          chainId,
          tx_hash: hash,
        });
      }
    },
    [closeModal, chain],
  );

  return {
    isDepositing: isDepositing || isTransferring,
    apolloDeposit,
  };
};
