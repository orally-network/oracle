import { create } from 'zustand';
import { Address } from '@wagmi/core';

import sybilCanister from 'Canisters/sybilCanister';
import { AddressData, GeneralResponse } from 'Interfaces/common';
import { remove0x } from 'Utils/addressUtils';
import logger from 'Utils/logger';
import { CHAINS_MAP } from 'Constants/chains';
import { TOKEN_IMAGES } from 'Constants/tokens';

export interface AllowedToken {
  address: Address;
  symbol: string;
  decimals: number;
}

export interface AllowedChain {
  chainId: number;
  symbol: string;
  // tokens: HashMap<string, AllowedToken>;
  tokens: AllowedToken[];
}

export interface SybilBalance {
  sybilTreasureAddress: Address;

  balance: number;
  isBalanceLoading: boolean;

  // allowedChains: HashMap<number, AllowedChain>;
  allowedChains: AllowedChain[],
  isChainsLoading: boolean;

  error: string;
}

export const useSybilBalanceStore = create<SybilBalance>()(() => ({
  sybilTreasureAddress: '0x',

  balance: 0,
  isBalanceLoading: false,

  allowedChains: [],
  isChainsLoading: false,

  error: '',
}));

const fetchSybilTreasureAddress = async () => {
  // @ts-ignore
  const res: Address = await sybilCanister.get_treasure_address();

  if (res) {
    useSybilBalanceStore.setState({ sybilTreasureAddress: res });
  } else {
    logger.error(`Failed to get sybil eth address, ${res}`);
  }
};
fetchSybilTreasureAddress();

export const fetchBalance = async (address: string) => {
  useSybilBalanceStore.setState({ isBalanceLoading: true });
  const balance: any = await sybilCanister.get_balance(address);
  useSybilBalanceStore.setState({ isBalanceLoading: false });

  if (balance.Ok || Number(balance.Ok) === 0) {
    useSybilBalanceStore.setState({ balance: Number(balance.Ok) });
    return Number(balance.Ok);
  } else {
    useSybilBalanceStore.setState({ error: balance.Err });
    logger.error(`Failed to get balance for ${address}, ${balance.Err}`);

    return 0;
  }
};

export const deposit = async (chainId: number, tx_hash: string, addressData: AddressData) => {
  // @ts-ignore
  const res: GeneralResponse = await sybilCanister.deposit(
    chainId,
    tx_hash,
    [], // grantee
    addressData.message,
    remove0x(addressData.signature)
  );

  console.log('deposit sybil res', res);
  if (res.Err) {
    logger.error(`Failed to deposit ${tx_hash}, ${res.Err}`);
    throw new Error(`Failed to deposit ${tx_hash}, ${res.Err}`);
  }

  return res;
};

// todo: add to tokens coin of the chain + change transfer for this case
export const fetchBalanceAllowedChains = async () => {
  useSybilBalanceStore.setState({ isChainsLoading: true });
  const allowedChains: any = await sybilCanister.get_allowed_chains();
  useSybilBalanceStore.setState({ isChainsLoading: false });

  const chains = allowedChains.map(([chainId, chainData]: any) => ({
    chainId: Number(chainId),
    symbol: chainData.coin_symbol,
    tokens: chainData.erc20_contracts.map((tokenData: any) => ({
      address: tokenData.erc20_contract,
      symbol: tokenData.token_symbol,
      decimals: tokenData.decimals,

      // select fields
      value: tokenData.erc20_contract,
      label: tokenData.token_symbol,
      key: tokenData.erc20_contract,
      avatar: TOKEN_IMAGES[tokenData.token_symbol.toUpperCase()] ?? TOKEN_IMAGES.default,
    })),

    // select fields
    value: Number(chainId),
    label: CHAINS_MAP[chainId].name,
    key: Number(chainId),
    avatar: CHAINS_MAP[chainId].img,
  }))

  useSybilBalanceStore.setState({ allowedChains: chains });

  return chains;
};
