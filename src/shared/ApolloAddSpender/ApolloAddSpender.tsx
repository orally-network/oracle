import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@nextui-org/react';

import { AddSpenderModal } from 'Shared/AddSpenderModal';
import { useModal } from 'Components/Modal';
import { mapChainsToNewOptions } from 'Utils/mappers';
import { type ApolloInstance, useGrantAllowance } from 'Services/apolloService';
import { Address } from 'viem';

interface ApolloTopUpProps {
  apolloInstances?: ApolloInstance[];
  isChainsLoading: boolean;
}

export const ApolloAddSpender = ({ apolloInstances, isChainsLoading }: ApolloTopUpProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useModal();

  const [chain, setChain] = useState<ApolloInstance | null>(null);

  const { mutate: grantAllowance, isPending: isGranting } = useGrantAllowance();

  const apolloAddSpender = useCallback(
    async (chainId: number, spender: Address) => {
      onClose();

      grantAllowance({ chainId, spender });
    },
    [onClose],
  );

  const mappedChains = useMemo(
    () => apolloInstances && mapChainsToNewOptions(apolloInstances),
    [apolloInstances],
  );

  useEffect(() => {
    if (mappedChains && mappedChains.length > 0) {
      setChain(mappedChains[0]);
    }
  }, [mappedChains]);

  return (
    <>
      <Button color="primary" onPress={onOpen} isLoading={isGranting || isChainsLoading}>
        Add Spender
      </Button>

      {mappedChains && chain && (
        <AddSpenderModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          chains={mappedChains}
          submit={apolloAddSpender}
          setChain={setChain}
          chain={chain}
        />
      )}
    </>
  );
};
