import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAccount } from 'wagmi';

import { remove0x } from 'Utils/addressUtils';
import { useGlobalState } from 'Providers/GlobalState';
import logger from 'Utils/logger';
import pythiaCanister from 'Canisters/pythiaCanister';
import { CHAINS_MAP } from 'Constants/chains';
import config from 'Constants/config';
import PythiaDataContext from './PythiaDataContext';
import { FilterType, SubscriptionData } from 'Interfaces/subscription';
import { DEFAULT_SUBSCRIPTIONS_SIZE } from 'Constants/ui';
import debounce from 'lodash.debounce';
import { useSearchParams } from 'react-router-dom';

interface FetchSubsParams {
  pagination?: {
    page: number;
    size?: number;
  };
  filters?: {
    isActive: boolean[];
    chainIds: number[];
    owner: string[];
    search: string[];
    methodType: string[];
  };
}

const PythiaDataProvider = ({ children }: any) => {
  const [subs, setSubs] = useState<SubscriptionData>({
    items: [],
    page: 1,
    size: 10,
    total_pages: 0,
    total_items: 10,
  });

  const [showMine, setShowMine] = useState<boolean>(false);
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [filterByType, setFilterByType] = useState<FilterType>('Empty');
  const [chainIds, setChainIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isSubsLoading, setIsSubsLoading] = useState(false);
  const [chains, setChains] = useState([]);
  const [isChainsLoading, setIsChainsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [pma, setPma] = useState('');

  const { addressData } = useGlobalState();

  const { address } = useAccount();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const debouncedChangeHandler = useMemo(() => debounce(onSearch, 300), []);

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  const fetchSubs = async ({ pagination }: FetchSubsParams) => {
    const { page, size } = pagination || {};
    setIsSubsLoading(true);
    try {
      const subsData: SubscriptionData = await pythiaCanister.get_subscriptions(
        [
          {
            is_active: showInactive === true ? [] : [true],
            chain_ids: chainIds.length ? [chainIds.map((value: string) => BigInt(value))] : [],
            owner: showMine ? [address] : [],
            search: searchQuery ? [searchQuery] : [],
            method_type: filterByType !== 'Empty' ? [{[filterByType]: ''}] : [],
          },
        ],
        [
          {
            page,
            size: size || DEFAULT_SUBSCRIPTIONS_SIZE,
          },
        ]
      );
      console.log({ subsData });
      setSubs(subsData);
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubsLoading(false);
    }
  };

  const fetchChains = useCallback(async () => {
    setIsChainsLoading(true);

    const chains = await pythiaCanister.get_chains();
    console.log({ chains });

    setIsChainsLoading(false);
    if (Array.isArray(chains)) {
      const visibleChains: any = config.isStaging
        ? chains
        : chains.filter((chain) => !CHAINS_MAP[chain.chain_id].testnet);

      setChains(visibleChains);
    }
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
    const pma = await pythiaCanister.get_pma();

    console.log({ pma });
    if (pma.Ok) {
      setPma(pma.Ok);
    } else {
      logger.error(`Failed to get pma, ${pma.Err}`);
    }
  }, []);

  const deposit = useCallback(
    async (chainId, tx_hash) => {
      const res = await pythiaCanister.deposit(
        chainId,
        tx_hash,
        addressData.message,
        remove0x(addressData.signature)
      );

      console.log('deposit res', res);
      if (res.Err) {
        logger.error(`Failed to deposit ${tx_hash}, ${res.Err}`);
      }
    },
    [addressData]
  );

  useEffect(() => {
    fetchChains();
    fetchPma();
    fetchSubs({
      pagination: {
        page: subs.page,
      },
    });
  }, []);

  useEffect(() => {
    fetchSubs({
      pagination: {
        page: 1,
      },
    });
  }, [showMine, showInactive, filterByType, chainIds, searchQuery]);

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
  ]);

  return <PythiaDataContext.Provider value={value}>{children}</PythiaDataContext.Provider>;
};

export default PythiaDataProvider;
