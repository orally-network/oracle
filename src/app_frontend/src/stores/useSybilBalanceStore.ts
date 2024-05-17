import { Address } from '@wagmi/core';
import sybilCanister from 'Canisters/sybilCanister';
import { AddressData, GeneralResponse } from 'Interfaces/common';
import { remove0x } from 'Utils/addressUtils';
import logger from 'Utils/logger';
import { create } from 'zustand'

type SybilBalance = {
  balance: number;
  isBalanceLoading: boolean;
  error: string;
  sybilEthAddress: Address;
}

export const useSybilBalanceStore = create<SybilBalance>()((set) => ({
  sybilEthAddress: '0x',

  balance: 0,
  isBalanceLoading: false,

  chains: [],
  tokens: [],

  error: '',
}));

const fetchSybilEthAddress = async () => {
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
