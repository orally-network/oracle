import { createContext } from "react";

const SubscriptionsFiltersContext = createContext({
  showAll: false,
  showPair: false,
  chainId: null,
  showInactive: false,
  setShowAll: () => {},
  setShowPair: () => {},
  setChainId: () => {},
  setShowInactive: () => {},
});

export default SubscriptionsFiltersContext;
