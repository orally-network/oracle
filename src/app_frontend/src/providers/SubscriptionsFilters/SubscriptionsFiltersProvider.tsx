import React, { useState } from 'react';

import SubscriptionsFiltersContext from './SubscriptionsFiltersContext';

const SubscriptionsFiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const [showAll, setShowAll] = useState<boolean>(true);
  const [showPair, setShowPair] = useState<boolean>(true);
  const [showRandom, setShowRandom] = useState<boolean>(true);
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [chainIds, setChainIds] = useState<string[]>([]);

  const value = {
    showAll,
    showPair,
    showRandom,
    chainIds,
    showInactive,
    setShowAll,
    setShowPair,
    setChainIds,
    setShowInactive,
    setShowRandom,
  };

  return (
    <SubscriptionsFiltersContext.Provider value={value}>
      {children}
    </SubscriptionsFiltersContext.Provider>
  );
};

export default SubscriptionsFiltersProvider;
