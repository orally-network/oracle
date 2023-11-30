import { AddressData } from 'Interfaces/common';
import { createContext } from 'react';

const GlobalStateContext = createContext({
  addressData: {
    message: '',
    signature: '',
    address: '',
  },
  setAddressData: (addressData: AddressData) => {},
});

export default GlobalStateContext;
