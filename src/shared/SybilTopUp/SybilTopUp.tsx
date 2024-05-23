import { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';

import { TopUpModal } from 'Shared/TopUpModal';
import { useFetchAllowedChains, AllowedChain } from 'Services/sybilService';
import { useModal } from 'Components/Modal';

import { useSybilDeposit } from './useSybilDeposit';

export const SybilTopUp = () => {
  const { isOpen, onOpen, onOpenChange } = useModal();

  const [chain, setChain] = useState<AllowedChain | null>(null);

  const { isConfirming, sybilDeposit } = useSybilDeposit({ setIsModalVisible: onOpenChange });

  const { data: allowedChains, isLoading: isChainsLoading } = useFetchAllowedChains();

  useEffect(() => {
    if (allowedChains && allowedChains.length > 0) {
      setChain(allowedChains[0]);
    }
  }, [allowedChains]);

  return  (
    <>
      <Button
        color="primary"
        onPress={onOpen}
        isLoading={isConfirming || isChainsLoading}
      >
        Top Up
      </Button>

      {allowedChains && chain && (
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
