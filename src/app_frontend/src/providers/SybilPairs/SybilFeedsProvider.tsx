import React, { useState, useMemo, useEffect } from 'react';

import SybilFeedsContext from './SybilFeedsContext';
import { FeedRequest, FilterFeedType, SignatureData } from 'Interfaces/feed';
import debounce from 'lodash.debounce';
import sybilCanister from 'Canisters/sybilCanister';
import { remove0x } from 'Utils/addressUtils';
import logger from 'Utils/logger';
import { AddressData, GeneralResponse } from 'Interfaces/common';
import { readContract } from '@wagmi/core';
import { ARBITRUM_CHAIN_ID } from 'Providers/WeatherAuctionData/WeatherAuctionProvider';

const VERIFY_UNPACKED_CONTRACT_ADDRESS = '0x49353d54cc6d23079c6748a2a2160d39a5b3358e';

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

  const createFeed = async (feed: FeedRequest) => {
    const res: GeneralResponse = await sybilCanister.create_custom_feed(feed);

    console.log('create feed result', res);
    if (res.Err) {
      logger.error(`Failed to create feed, ${res.Err}`);
      throw new Error(`${res.Err} Try again later.`);
    }

    return res;
  };

  const readVerifyUnpacked = async (signatureData: SignatureData) => {
    return await readContract({
      address: VERIFY_UNPACKED_CONTRACT_ADDRESS,
      abi: [
        {
          name: 'verifyUnpacked',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            {
              name: '_pairId',
              type: 'string',
            },
            {
              name: '_price',
              type: 'uint256',
            },
            {
              name: '_decimals',
              type: 'uint256',
            },
            {
              name: '_timestamp',
              type: 'uint256',
            },
            {
              name: '_signature',
              type: 'bytes',
            },
          ],
          outputs: [
            {
              name: '',
              type: 'bool',
            },
          ],
        },
      ],
      functionName: 'verifyUnpacked',
      args: [
        signatureData.pairId,
        signatureData.price,
        signatureData.decimals,
        signatureData.timestamp,
        signatureData.signature,
      ],
      chainId: ARBITRUM_CHAIN_ID,
    });
  };

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  const value = useMemo(() => {
    return {
      deposit,
      createFeed,
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
      readVerifyUnpacked,
    };
  }, [page, feedType, searchQuery, showMine, setShowMine]);

  return <SybilFeedsContext.Provider value={value}>{children}</SybilFeedsContext.Provider>;
};

export default SybilFeedsProvider;
