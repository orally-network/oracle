import React, { useState } from "react";

import SubscriptionsFiltersContext from "./SubscriptionsFiltersContext";

const SubscriptionsFiltersProvider = ({ children }) => {
  const [showAll, setShowAll] = useState(false);
  const [showPair, setShowPair] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  const value = {
    showAll,
    showPair,
    chainId,
    showInactive,
    setShowAll,
    setShowPair,
    setChainId,
    setShowInactive,
  };

  return (
    <SubscriptionsFiltersContext.Provider value={value}>
      {children}
    </SubscriptionsFiltersContext.Provider>
  );
};

export default SubscriptionsFiltersProvider;
