import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAccount } from 'wagmi';

import { remove0x } from 'Utils/addressUtils';
import { useGlobalState } from 'Providers/GlobalState';
import logger from 'Utils/logger';
import pythiaCanister from 'Canisters/pythiaCanister';
import PythiaDataContext from './PythiaDataContext';

const PythiaDataProvider = ({ children }) => {
  const [subs, setSubs] = useState([]);
  const [isSubsLoading, setIsSubsLoading] = useState(false);
  const [chains, setChains] = useState([]);
  const [isChainsLoading, setIsChainsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [pma, setPma] = useState('');

  const { addressData } = useGlobalState();

  const { address } = useAccount();

  const fetchSubs = useCallback(async () => {
    setIsSubsLoading(true);

    const subs = await pythiaCanister.get_subscriptions([]);
    console.log({subs})

    setIsSubsLoading(false);
    if (Array.isArray(subs)) setSubs(subs);
  }, [address]);

  const fetchChains = useCallback(async () => {
    setIsChainsLoading(true);

    const chains = await pythiaCanister.get_chains();
    console.log({chains});

    setIsChainsLoading(false);
    if (Array.isArray(chains)) {
      setChains(chains);
    }
  }, []);
  
  const fetchBalance = useCallback(async (chainId, address) => {
    setIsBalanceLoading(true);
    
    console.log({chainId, address});
    const balance = await pythiaCanister.get_balance(chainId, remove0x(address));
    console.log({balance});
    
    setIsBalanceLoading(false);
    if (balance.Ok) {
      return balance.Ok;
    } else {
      logger.error(`Failed to get balance for ${address}, ${balance.Err}`)
      
      return 0;
    }
  }, []);
  
  const fetchPma = useCallback(async () => {
    const pma = await pythiaCanister.get_pma();
    
    console.log({pma})
    if (pma.Ok) {
      setPma(pma.Ok);
    } else {
      logger.error(`Failed to get pma, ${pma.Err}`)
    }
  }, []);
  
  const deposit = useCallback(async (chainId, tx_hash) => {
    const res = await pythiaCanister.deposit(chainId, tx_hash, addressData.message, remove0x(addressData.signature));
    
    console.log('deposit res', res);
    if (res.Err) {
      logger.error(`Failed to deposit ${tx_hash}, ${res.Err}`);
    }
  }, [addressData]);
  
  useEffect(() => {
    fetchChains();
    fetchPma();
    fetchSubs();
  }, []);
  
  const value = useMemo(() => {
    return {
      subs,
      isSubsLoading,
      chains,
      isChainsLoading,
      fetchSubs,
      fetchBalance,
      balance,
      isBalanceLoading,
      deposit,
      pma,
    };
  }, [subs, isSubsLoading, chains, isChainsLoading, fetchSubs, balance, isBalanceLoading, deposit, pma]);
  
  return (
    <PythiaDataContext.Provider value={value}>
      {children}
    </PythiaDataContext.Provider>
  );
};

export default PythiaDataProvider;
