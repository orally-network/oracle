import type { Token, TokenAmount } from '@lifi/types';
import { useQuery } from '@tanstack/react-query';
import { getTokens, getTokenBalancesByChain } from '@lifi/sdk';
import { Address } from 'viem';

import logger from 'Utils/logger';

export type ChainTokenMap = {
  [chainId: number]: Address[];
};

export type ChainTokenBalances = { [chainId: number]: TokenAmount[] };

type TokensByChain = { [chainId: number]: Token[] };

// query
export const useTokenBalances = (chainTokenMap: ChainTokenMap, walletAddress?: Address) =>
  useQuery({
    queryKey: ['token-balances', walletAddress, chainTokenMap],
    queryFn: async () => {
      try {
        if (!walletAddress) return [];

        const tokensResponse = await getTokens({
          chains: Object.keys(chainTokenMap).map(Number),
        });

        const filteredTokens = Object.keys(chainTokenMap).reduce<TokensByChain>((acc, chainId) => {
          acc[Number(chainId)] = tokensResponse.tokens[Number(chainId)].filter((token) =>
            chainTokenMap[Number(chainId)].includes(<`0x${string}`>token.address),
          );

          return acc;
        }, {});

        const tokenBalances: ChainTokenBalances = await getTokenBalancesByChain(
          walletAddress,
          filteredTokens,
        );

        logger.log('[service] queried token balances', { tokenBalances });

        return tokenBalances;
      } catch (error) {
        logger.error('[service] Failed to query api keys', error);
      }

      return;
    },
    enabled: Boolean(walletAddress && Object.keys(chainTokenMap).length > 0),
  });
