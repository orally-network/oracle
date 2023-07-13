import React, { useState } from "react";

import SubscriptionsFiltersContext from "./SubscriptionsFiltersContext";

const SubscriptionsFiltersProvider = ({ children }) => {
  const [showAll, setShowAll] = useState(true);
  const [showPair, setShowPair] = useState(true);
  const [showRandom, setShowRandom] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [chainId, setChainId] = useState(null);

  const value = {
    showAll,
    showPair,
    showRandom,
    chainId,
    showInactive,
    setShowAll,
    setShowPair,
    setChainId,
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
