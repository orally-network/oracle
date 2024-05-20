import { create } from 'zustand';
import { Address } from '@wagmi/core';

import sybilCanister from 'Canisters/sybilCanister';
import { AddressData, GeneralResponse } from 'Interfaces/common';
import { remove0x } from 'Utils/addressUtils';
import logger from 'Utils/logger';

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
  sybilEthAddress: Address;

  balance: number;
  isBalanceLoading: boolean;

  // allowedChains: HashMap<number, AllowedChain>;
  allowedChains: AllowedChain[],
  isChainsLoading: boolean;

  error: string;
}

export const useSybilBalanceStore = create<SybilBalance>()(() => ({
  sybilEthAddress: '0x',

  balance: 0,
  isBalanceLoading: false,

  allowedChains: {},
  isChainsLoading: false,

  error: '',
}));

const fetchSybilEthAddress = async () => {
  // @ts-ignore
  const res: GeneralResponse = await sybilCanister.eth_address();

  if (res.Ok) {
    useSybilBalanceStore.setState({ sybilEthAddress: res.Ok });
  } else {
    logger.error(`Failed to get sybil eth address, ${res.Err}`);
  }
};
fetchSybilEthAddress();

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

export const deposit = async (tx_hash: string, addressData: AddressData) => {
  // @ts-ignore
  const res: GeneralResponse = await sybilCanister.deposit(
    tx_hash,
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

export const fetchBalanceAllowedChains = async () => {
  useSybilBalanceStore.setState({ isChainsLoading: true });
  const allowedChains: any = await sybilCanister.get_allowed_chains();
  useSybilBalanceStore.setState({ isChainsLoading: false });

  const chains = allowedChains.map(([chainId, chainData]: any) => ({
    chainId,
    symbol: chainData.coin_symbol,
    tokens: chainData.erc20_contracts.map((tokenData: any) => ({
      address: tokenData.erc20_contract,
      symbol: tokenData.token_symbol,
      decimals: tokenData.decimals,

      value: tokenData.erc20_contract,
      label: tokenData.token_symbol,
    })),

    value: chainId,
    label: chainId,
  }))

  useSybilBalanceStore.setState({ allowedChains: chains });

  return chains;
};
