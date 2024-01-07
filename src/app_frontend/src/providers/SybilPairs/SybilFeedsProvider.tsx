import React, { useState, useMemo, useEffect } from 'react';

import SybilFeedsContext from './SybilFeedsContext';
import { FilterFeedType } from 'Interfaces/feed';
import debounce from 'lodash.debounce';

const SybilFeedsProvider = ({ children }: any) => {
  const [page, setPage] = useState<number>(1);
  const [showMine, setShowMine] = useState<boolean>(false);
  const [feedType, setFeedType] = useState<FilterFeedType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const debouncedChangeHandler = useMemo(() => debounce(onSearch, 300), []);

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  const value = useMemo(() => {
    return {
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
  }, [page, feedType, searchQuery, showMine]);

  return <SybilFeedsContext.Provider value={value}>{children}</SybilFeedsContext.Provider>;
};

export default SybilFeedsProvider;
