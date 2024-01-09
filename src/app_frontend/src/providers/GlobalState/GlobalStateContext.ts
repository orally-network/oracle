import { AddressData } from 'Interfaces/common';
import { createContext } from 'react';

const GlobalStateContext = createContext({
  addressData: {
    message: '',
    signature: '',
    address: '',
    executionAddress: '',
  },
  setAddressData: (addressData: AddressData) => {},
});

export default GlobalStateContext;
