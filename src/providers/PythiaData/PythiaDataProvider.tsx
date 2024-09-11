import React, { useEffect, useState, useMemo, useCallback } from 'react';

import { remove0x } from 'Utils/addressUtils';
import { useGlobalState } from 'Providers/GlobalState';
import logger from 'Utils/logger';
import pythiaCanister from 'Canisters/pythiaCanister';
import PythiaDataContext from './PythiaDataContext';
import { FilterType } from 'Interfaces/subscription';
import debounce from 'lodash.debounce';
import { GeneralResponse } from 'Interfaces/common';

const PythiaDataProvider = ({ children }: any) => {
  const [page, setPage] = useState<number>(1);
  const [showMine, setShowMine] = useState<boolean>(false);
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [filterByType, setFilterByType] = useState<FilterType>('Empty');
  const [chainIds, setChainIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [balance] = useState(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [pma, setPma] = useState<`0x${string}`>('0x');

  const { addressData } = useGlobalState();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const debouncedChangeHandler = useMemo(() => debounce(onSearch, 300), []);

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  const fetchBalance = useCallback(async (chainId: number, address: string) => {
    setIsBalanceLoading(true);

    const balance: any = await pythiaCanister.get_balance(chainId, remove0x(address));

    setIsBalanceLoading(false);
    if (balance.Ok || Number(balance.Ok) === 0) {
      return balance.Ok;
    } else {
      logger.error(`Failed to get balance for ${address}, ${balance.Err}`);

      return 0;
    }
  }, []);

  const fetchPma = useCallback(async () => {
    const pma: GeneralResponse = await pythiaCanister.get_pma();

    console.log({ pma });
    if (pma.Ok) {
      setPma(pma.Ok);
    } else {
      logger.error(`Failed to get pma, ${pma.Err}`);
    }
  }, []);

  const deposit = useCallback(
    async (chainId, tx_hash) => {
      const res: GeneralResponse = await pythiaCanister.deposit(
        chainId,
        tx_hash,
        addressData.message,
        remove0x(addressData.signature),
      );

      console.log('deposit res', res);
      if (res.Err) {
        logger.error(`Failed to deposit ${tx_hash}, ${res.Err}`);
        throw new Error(`Failed to deposit ${tx_hash}, ${res.Err}`);
      }
      return res;
    },
    [addressData],
  );

  useEffect(() => {
    fetchPma();
  }, []);

  const value = useMemo(() => {
    return {
      page,
      setPage,
      fetchBalance,
      balance,
      isBalanceLoading,
      deposit,
      pma,
      showMine,
      showInactive,
      filterByType,
      chainIds,
      searchQuery,
      setShowMine,
      setShowInactive,
      setFilterByType,
      setChainIds,
      setSearchQuery,
      debouncedChangeHandler,
    };
  }, [
    page,
    fetchBalance,
    balance,
    isBalanceLoading,
    deposit,
    pma,
    showMine,
    showInactive,
    filterByType,
    chainIds,
    searchQuery,
  ]);

  return <PythiaDataContext.Provider value={value}>{children}</PythiaDataContext.Provider>;
};

export default PythiaDataProvider;
