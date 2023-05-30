import { createContext } from 'react';

const GlobalStateContext = createContext({
    addressData: {},
    setAddressData: () => {},
});

export default GlobalStateContext;
