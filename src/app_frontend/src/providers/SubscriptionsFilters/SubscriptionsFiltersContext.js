import { createContext } from "react";

const SubscriptionsFiltersContext = createContext({
  showAll: true,
  showPair: true,
  showRandom: true,
  showInactive: false,
  chainId: null,
  setShowAll: () => {},
  setShowPair: () => {},
  setShowRandom: () => {},
  setShowInactive: () => {},
  setChainId: () => {},
});

export default SubscriptionsFiltersContext;
