import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAccount } from 'wagmi';

import { getLocalStorageAddress } from 'Utils/localStorageAddress';

import GlobalStateContext from './GlobalStateContext';

const GlobalStateProvider = ({ children }) => {
  const [addressData, setAddressData] = useState();

  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      setAddressData(getLocalStorageAddress(address));
    }
  }, [address]);
  
  const value = useMemo(() => {
    return {
      addressData,
      setAddressData,
    };
  }, [addressData]);
  
  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
