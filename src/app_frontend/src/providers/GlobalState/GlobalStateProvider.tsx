import React, { useEffect, useState, useMemo } from 'react';
import { useAccount } from 'wagmi';

import { getLocalStorageAddress } from 'Utils/localStorageAddress';

import GlobalStateContext from './GlobalStateContext';
import { AddressData } from 'Interfaces/common';

const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [addressData, setAddressData] = useState<AddressData>({
    address: '',
    signature: '',
    message: '',
  });

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

  return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>;
};

export default GlobalStateProvider;
