import React, { useState, useMemo, useEffect, useCallback } from 'react';

import SybilFeedsContext from './SybilFeedsContext';
import { FilterFeedType } from 'Interfaces/feed';
import debounce from 'lodash.debounce';
import sybilCanister from 'Canisters/sybilCanister';
import { remove0x } from 'Utils/addressUtils';
import logger from 'Utils/logger';
import { AddressData, GeneralResponse } from 'Interfaces/common';

const SybilFeedsProvider = ({ children }: any) => {
  const [page, setPage] = useState<number>(1);
  const [showMine, setShowMine] = useState<boolean>(false);
  const [feedType, setFeedType] = useState<FilterFeedType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const debouncedChangeHandler = useMemo(() => debounce(onSearch, 300), []);

  const fetchBalance = async (addressData: AddressData) => {
    setIsBalanceLoading(true);
    const balance: any = await sybilCanister.get_balance(addressData.address);
    setIsBalanceLoading(false);

    if (balance.Ok || Number(balance.Ok) === 0) {
      return balance.Ok;
    } else {
      logger.error(`Failed to get balance for ${addressData.address}, ${balance.Err}`);

      return 0;
    }
  };

  const deposit = async (tx_hash: string, addressData: AddressData) => {
    const res: GeneralResponse = await sybilCanister.deposit(
      tx_hash,
      addressData.message,
      remove0x(addressData.signature)
    );

    console.log('deposit sybil res', res);
    if (res.Err) {
      logger.error(`Failed to deposit ${tx_hash}, ${res.Err}`);
      throw new Error(`Failed to deposit ${tx_hash}, ${res.Err}`);
    }

    return res;
  };

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  const value = useMemo(() => {
    return {
      deposit,
      page,
      feedType,
      searchQuery,
      showMine,
      setFeedType,
      setPage,
      setShowMine,
      setSearchQuery,
      debouncedChangeHandler,
      fetchBalance,
      isBalanceLoading,
    };
  }, [page, feedType, searchQuery, showMine]);

  return <SybilFeedsContext.Provider value={value}>{children}</SybilFeedsContext.Provider>;
};

export default SybilFeedsProvider;
