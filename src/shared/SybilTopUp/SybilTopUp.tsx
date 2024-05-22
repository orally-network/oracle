import { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';

import { TopUpModal } from 'Shared/TopUpModal';
import { useSybilBalanceStore, fetchBalanceAllowedChains, AllowedChain } from 'Stores/useSybilBalanceStore';
import { useModal } from 'Components/Modal';

import { useSybilDeposit } from './useSybilDeposit';

export const SybilTopUp = () => {
  const { isOpen, onOpen, onOpenChange } = useModal();

  const allowedChains = useSybilBalanceStore((state) => state.allowedChains);
  const isChainsLoading = useSybilBalanceStore((state) => state.isChainsLoading);

  const [chain, setChain] = useState<AllowedChain | null>(null);

  const { isConfirming, sybilDeposit } = useSybilDeposit({ setIsModalVisible: onOpenChange });

  useEffect(() => {
    fetchBalanceAllowedChains().then(chains => {
      setChain(chains[0]);
    });
  }, []);

  return  (
    <>
      <Button
        color="primary"
        onPress={onOpen}
        isLoading={isConfirming}
      >
        Top Up
      </Button>

      {chain && (
        <TopUpModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          chains={allowedChains}
          isChainsLoading={isChainsLoading}
          tokens={chain ? chain.tokens : []}
          submit={sybilDeposit}
          setChain={setChain}
          chain={chain}
        />
      )}
    </>
  )
};
