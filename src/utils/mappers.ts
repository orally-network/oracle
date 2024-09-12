import { CHAINS_MAP } from 'Constants/chains';
import { TOKEN_IMAGES } from 'Constants/tokens';

export const mapChainToNewOption = (chain: any) => {
  const chainData = CHAINS_MAP[chain.chainId];

  return {
    ...chain,
    key: chainData.id,
    label: chainData.name,
    value: chainData.id,
    avatar: chainData.img,
  };
};

export const mapChainsToNewOptions = (chains: any) => chains.map(mapChainToNewOption);

export const mapTokenToOption = (token: any) => ({
  ...token,
  key: token.address,
  label: token.symbol,
  value: token.balance ?? token.address,
  avatar: TOKEN_IMAGES[token.symbol.toUpperCase()] ?? TOKEN_IMAGES.default,
});

export const mapTokensToOptions = (tokens: any) => tokens.map(mapTokenToOption);
