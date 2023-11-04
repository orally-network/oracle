import React, { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce';

import SubscriptionsFiltersContext from './SubscriptionsFiltersContext';
import { FilterType } from 'Interfaces/subscription';

const SubscriptionsFiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const [showMine, setShowMine] = useState<boolean>(false);
  const [filterByType, setFilterByType] = useState<FilterType>('all');
  const [chainIds, setChainIds] = useState<string[]>([]);
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

  const value = {
    showMine,
    filterByType,
    chainIds,
    searchQuery,
    setShowMine,
    setFilterByType,
    setChainIds,
    debouncedChangeHandler,
  };

  return (
    <SubscriptionsFiltersContext.Provider value={value}>
      {children}
    </SubscriptionsFiltersContext.Provider>
  );
};

export default SubscriptionsFiltersProvider;
