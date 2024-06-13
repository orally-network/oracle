import { useState, useEffect, useMemo } from 'react';
import { Button } from '@nextui-org/react';

import { TopUpModal } from 'Shared/TopUpModal';
import { useModal } from 'Components/Modal';
import { mapTokenToOption, mapChainsToNewOptions } from 'Utils/mappers';
import { type ApolloInstance } from 'Services/apolloService';
import { nativeEthToken } from 'Constants/tokens';

import { useApolloDeposit } from './useApolloDeposit';

interface ApolloTopUpProps {
  apolloInstances?: ApolloInstance[],
  isChainsLoading: boolean,
}

const mappedNativeToken = mapTokenToOption(nativeEthToken);
const tokens = [mappedNativeToken];

export const ApolloTopUp = ({ apolloInstances, isChainsLoading }: ApolloTopUpProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useModal();

  const [chain, setChain] = useState<ApolloInstance | null>(null);

  const { isDepositing, apolloDeposit } = useApolloDeposit({
    closeModal: onClose,
    chain,
  });

  const mappedChains = useMemo(() => apolloInstances && mapChainsToNewOptions(apolloInstances), [apolloInstances]);

  useEffect(() => {
    if (mappedChains && mappedChains.length > 0) {
      setChain(mappedChains[0]);
    }
  }, [mappedChains]);

  return  (
    <>
      <Button
        color="primary"
        onPress={onOpen}
        isLoading={isDepositing || isChainsLoading}
      >
        Top Up
      </Button>

      {mappedChains && chain && (
        <TopUpModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          chains={mappedChains}
          isChainsLoading={isChainsLoading}
          submit={apolloDeposit}
          setChain={setChain}
          chain={chain}
          tokens={tokens}
          token={mappedNativeToken}
        />
      )}
    </>
  )
};
