import React, { useState, useMemo, useEffect, useCallback } from 'react';

import SybilFeedsContext from './SybilFeedsContext';
import { FeedRequest, FilterFeedType } from 'Interfaces/feed';
import debounce from 'lodash.debounce';
import sybilCanister from 'Canisters/sybilCanister';
import logger from 'Utils/logger';
import { GeneralResponse } from 'Interfaces/common';

const SybilFeedsProvider = ({ children }: any) => {
  const [page, setPage] = useState<number>(1);
  const [showMine, setShowMine] = useState<boolean>(false);
  const [feedType, setFeedType] = useState<FilterFeedType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const debouncedChangeHandler = useMemo(() => debounce(onSearch, 300), []);

  const createFeed = useCallback(async (feed: FeedRequest) => {
    const res: GeneralResponse = await sybilCanister.create_custom_feed(feed);

    console.log('create feed result', res);
    if (res.Err) {
      logger.error(`Failed to create feed, ${res.Err}`);
      throw new Error(`${res.Err} Try again later.`);
    }

    return res;
  }, []);

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  const value = useMemo(() => {
    return {
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
    };
  }, [page, feedType, searchQuery, showMine, setShowMine]);

  return <SybilFeedsContext.Provider value={value}>{children}</SybilFeedsContext.Provider>;
};

export default SybilFeedsProvider;
