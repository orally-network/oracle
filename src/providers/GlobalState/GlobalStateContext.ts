import { Chain } from 'Interfaces/chain';
import { AddressData } from 'Interfaces/common';
import { createContext } from 'react';

interface GlobalStateContextInterface {
  addressData: AddressData;
  setAddressData: (addressData: AddressData) => void;
  chains: Chain[];
  isChainsLoading: boolean;
}

const GlobalStateContext = createContext<GlobalStateContextInterface>({
  addressData: {
    message: '',
    signature: '',
    address: '',
    executionAddress: '',
  },
  setAddressData: () => {},
  chains: [] as Chain[],
  isChainsLoading: false,
});

export default GlobalStateContext;
