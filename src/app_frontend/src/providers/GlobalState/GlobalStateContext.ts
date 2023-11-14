import { createContext } from 'react';

const GlobalStateContext = createContext({
    addressData: {
        message: '',
        signature: '',
    },
    setAddressData: () => {},
});

export default GlobalStateContext;
