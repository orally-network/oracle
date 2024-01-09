import React, { useEffect, useState, useMemo } from 'react';
import { useAccount } from 'wagmi';

import { getLocalStorageAddress } from 'Utils/localStorageAddress';

import GlobalStateContext from './GlobalStateContext';
import { AddressData } from 'Interfaces/common';
import pythiaCanister from 'Canisters/pythiaCanister';
import { Chain } from 'Interfaces/chain';
import { CHAINS_MAP } from 'Constants/chains';
import config from 'Constants/config';

const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [chains, setChains] = useState<Chain[]>([]);
  const [isChainsLoading, setIsChainsLoading] = useState(false);
  const [addressData, setAddressData] = useState<AddressData>({
    address: '',
    signature: '',
    message: '',
  });

  const { address } = useAccount();

  const fetchChains = async () => {
    setIsChainsLoading(true);

    const chains = await pythiaCanister.get_chains();
    console.log({ chains });

    setIsChainsLoading(false);
    if (Array.isArray(chains)) {
      const visibleChains: Chain[] = config.isStaging
        ? chains
        : chains.filter((chain) => !CHAINS_MAP[chain.chain_id].testnet);

      setChains(visibleChains);
    }
  };

  useEffect(() => {
    if (address) {
      setAddressData(getLocalStorageAddress(address));
    }
  }, [address]);

  useEffect(() => {
    fetchChains();
  }, []);

  const value = useMemo(() => {
    return {
      addressData,
      setAddressData,
      isChainsLoading,
      chains,
    };
  }, [addressData, isChainsLoading, chains]);

  return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>;
};

export default GlobalStateProvider;
