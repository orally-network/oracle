import { useState, useEffect, useMemo } from 'react';
import { Button } from '@nextui-org/react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';

import { useTokenBalances, ChainTokenMap } from 'Services/lifi';
import { TopUpModal } from 'Shared/TopUpModal';
import { useFetchAllowedChains } from 'Services/sybilService';
import { useModal } from 'Components/Modal';
import { mapTokensToOptions, mapChainsToNewOptions, mapTokenToOption } from 'Utils/mappers';
import { AllowedChain, AllowedToken } from 'Interfaces/common';
import { formatFiatPrice } from 'Utils/numberFormat';

import { useSybilDeposit } from './useSybilDeposit';

const getChainTokenMap = (allowedChains: AllowedChain[]) => {
  return allowedChains.reduce<ChainTokenMap>((acc, chain) => {
    acc[chain.chainId] = chain.tokens.map((token) => token.address);

    return acc;
  }, {});
};

export const SybilTopUp = () => {
  const { isOpen, onOpen, onOpenChange } = useModal();
  const { address } = useAccount();

  const [chain, setChain] = useState<AllowedChain>();
  const [token, setToken] = useState<AllowedToken>();

  const { isDepositing, sybilDeposit } = useSybilDeposit({ setIsModalVisible: onOpenChange });

  const { data: allowedChains, isLoading: isChainsLoading } = useFetchAllowedChains();

  const chainTokenMap = useMemo(() => getChainTokenMap(allowedChains ?? []), [allowedChains]);

  const { data: balances } = useTokenBalances(chainTokenMap, address);

  const mergedAllowedChains = useMemo(() => {
    if (!allowedChains) {
      return [];
    }

    return allowedChains.map((chain) => {
      const chainBalances = balances?.[chain.chainId] || [];

      return {
        ...chain,
        tokens: chain.tokens.map((token) => {
          const tokenAmount = chainBalances.find((balance) => balance.address === token.address);

          const tokenBalance =
            tokenAmount && tokenAmount.amount
              ? parseFloat(formatUnits(tokenAmount.amount, tokenAmount.decimals))
              : 0;

          return {
            ...token,
            balance: `${tokenBalance} (${formatFiatPrice(tokenBalance * parseFloat(String(tokenAmount?.priceUSD ?? 1)))})`,
          };
        }),
      };
    });
  }, [allowedChains, balances]);

  const mappedChains = useMemo(
    () => mergedAllowedChains && mapChainsToNewOptions(mergedAllowedChains),
    [mergedAllowedChains],
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
