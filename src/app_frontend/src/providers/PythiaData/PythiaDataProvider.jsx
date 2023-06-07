import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAccount } from 'wagmi';

import pythiaCanister from 'Canisters/pythiaCanister';
import PythiaDataContext from './PythiaDataContext';

const PythiaDataProvider = ({ children }) => {
  const [subs, setSubs] = useState([]);
  const [isSubsLoading, setIsSubsLoading] = useState(false);
  const [chains, setChains] = useState([]);
  const [isChainsLoading, setIsChainsLoading] = useState(false);

  const { address } = useAccount();

  const fetchSubs = useCallback(async () => {
    if (address) {
      setIsSubsLoading(true);

      const subs = await pythiaCanister.get_subs(address);
      console.log({subs})

      setIsSubsLoading(false);
      if (subs.Ok) setSubs(subs.Ok);
    }
  }, [address]);

  const fetchChains = useCallback(async () => {
    setIsChainsLoading(true);

    const chains = await pythiaCanister.get_chains();
    console.log({chains});

    setIsChainsLoading(false);
    if (chains.Ok) setChains(chains.Ok);
  }, []);

  useEffect(() => {
    fetchSubs();
  }, [address]);
  
  useEffect(() => {
    fetchChains();
  }, []);
  
  const value = useMemo(() => {
    return {
      subs,
      isSubsLoading,
      chains,
      isChainsLoading,
      fetchSubs,
    };
  }, [subs, isSubsLoading, chains, isChainsLoading, fetchSubs]);
  
  return (
    <PythiaDataContext.Provider value={value}>
      {children}
    </PythiaDataContext.Provider>
  );
};

export default PythiaDataProvider;
