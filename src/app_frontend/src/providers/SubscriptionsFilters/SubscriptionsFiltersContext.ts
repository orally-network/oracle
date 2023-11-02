import { createContext } from 'react';

const SubscriptionsFiltersContext = createContext({
  showAll: true,
  showPair: true,
  showRandom: true,
  showInactive: false,
  chainIds: [] as string[],
  setShowAll: (val: boolean) => {},
  setShowPair: (val: boolean) => {},
  setShowRandom: (val: boolean) => {},
  setShowInactive: (val: boolean) => {},
  setChainIds: (val: string[]) => {},
});

export default SubscriptionsFiltersContext;
