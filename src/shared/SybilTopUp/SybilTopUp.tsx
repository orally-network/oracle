import { useState, useEffect, useMemo } from 'react';
import { Button } from '@nextui-org/react';

import { TopUpModal } from 'Shared/TopUpModal';
import { useFetchAllowedChains } from 'Services/sybilService';
import { useModal } from 'Components/Modal';
import { mapTokensToOptions, mapChainsToNewOptions, mapTokenToOption } from 'Utils/mappers';
import { AllowedChain, AllowedToken } from 'Interfaces/common';

import { useSybilDeposit } from './useSybilDeposit';

export const SybilTopUp = () => {
  const { isOpen, onOpen, onOpenChange } = useModal();

  const [chain, setChain] = useState<AllowedChain>();
  const [token, setToken] = useState<AllowedToken>();

  const { isDepositing, sybilDeposit } = useSybilDeposit({ setIsModalVisible: onOpenChange });

  const { data: allowedChains, isLoading: isChainsLoading } = useFetchAllowedChains();

  const mappedChains = useMemo(
    () => allowedChains && mapChainsToNewOptions(allowedChains),
    [allowedChains],
  );
  const mappedTokens = useMemo(() => chain && mapTokensToOptions(chain.tokens), [chain]);

  useEffect(() => {
    if (mappedChains && mappedChains.length > 0) {
      const mappedChain = mappedChains[0];
      const token = mappedChain.tokens[0];

      setChain(mappedChain);
      if (token) {
        setToken(mapTokenToOption(token));
      }
    }
  }, [mappedChains]);

  useEffect(() => {
    if (chain && chain.tokens.length > 0 && chain.tokens[0]) {
      setToken(mapTokenToOption(chain.tokens[0]));
    }
  }, [chain]);

  const enabled = mappedChains && chain;

  return (
    <>
      <Button
        color="primary"
        onPress={onOpen}
        isDisabled={!enabled}
        isLoading={isDepositing || isChainsLoading}
      >
        Top Up
      </Button>

      {enabled && (
        <TopUpModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          chains={mappedChains}
          isChainsLoading={isChainsLoading}
          tokens={mappedTokens}
          submit={sybilDeposit}
          setChain={setChain}
          chain={chain}
          setToken={setToken}
          token={token}
        />
      )}
    </>
  );
};
