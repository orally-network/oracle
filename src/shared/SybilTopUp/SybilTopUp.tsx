import { useState, useEffect, useMemo } from 'react';
import { Button } from '@nextui-org/react';

import { TopUpModal } from 'Shared/TopUpModal';
import { useFetchAllowedChains, AllowedChain, AllowedToken } from 'Services/sybilService';
import { useModal } from 'Components/Modal';
import { mapTokensToOptions, mapChainsToNewOptions, mapTokenToOption } from 'Utils/mappers.ts';

import { useSybilDeposit } from './useSybilDeposit';

export const SybilTopUp = () => {
  const { isOpen, onOpen, onOpenChange } = useModal();

  const [chain, setChain] = useState<AllowedChain | null>(null);
  const [token, setToken] = useState<AllowedToken | null>(null);

  const { isDepositing, sybilDeposit } = useSybilDeposit({ setIsModalVisible: onOpenChange });

  const { data: allowedChains, isLoading: isChainsLoading } = useFetchAllowedChains();

  const mappedChains = useMemo(() => allowedChains && mapChainsToNewOptions(allowedChains), [allowedChains]);
  const mappedTokens = useMemo(() => chain && mapTokensToOptions(chain.tokens), [chain]);

  useEffect(() => {
    if (mappedChains && mappedChains.length > 0) {
      setChain(mappedChains[0]);
      setToken(mapTokenToOption(mappedChains[0].tokens[0]));
    }
  }, [mappedChains]);

  useEffect(() => {
    if (chain && chain.tokens.length > 0) {
      setToken(mapTokenToOption(chain.tokens[0]));
    }
  }, [chain]);

  return  (
    <>
      <Button
        color="primary"
        onPress={onOpen}
        isLoading={isDepositing || isChainsLoading}
      >
        Top Up
      </Button>

      {mappedChains && chain && token && (
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
  )
};
