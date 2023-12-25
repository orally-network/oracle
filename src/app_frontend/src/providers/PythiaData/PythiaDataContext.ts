import { Chain } from 'Interfaces/chain';
import { FilterType, SubscriptionData } from 'Interfaces/subscription';
import { createContext } from 'react';

interface PythiaDataContextInterface {
  subs: SubscriptionData;
  isSubsLoading: boolean;
  fetchSubs: (pagination?: {}, filter?: {}) => Promise<void>;
  chains: Chain[];
  isChainsLoading: boolean;
  fetchBalance: (chainId: BigInt | number, address: string) => void;
  balance: number;
  isBalanceLoading: boolean;
  pma: string;
  deposit: (chainId: string, hash: string) => Promise<any>;
  
  filterByType: FilterType;
  showMine: boolean;
  showInactive: boolean;
  chainIds: string[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  setShowMine: (val: boolean) => void;
  setShowInactive: (val: boolean) => void;
  setFilterByType: (val: FilterType) => void;
  setChainIds: (val: string[]) => void;
  debouncedChangeHandler: (val: React.ChangeEvent<HTMLInputElement>) => void;
}

const PythiaDataContext = createContext<PythiaDataContextInterface>({
  subs: {
    items: [],
    page: 1,
    total_pages: 0,
    size: 10,
    total_items: 10,
  },
  isSubsLoading: false,
  fetchSubs: () => Promise.resolve(),
  chains: [],
  isChainsLoading: false,
  fetchBalance: () => {},
  balance: 0,
  isBalanceLoading: false,
  pma: '',
  deposit: () => Promise.resolve(),

  filterByType: 'Empty',
  showMine: false,
  showInactive: false,
  chainIds: [] as string[],
  searchQuery: '',
  setSearchQuery: (val: string) => {},
  setShowMine: (val: boolean) => {},
  setShowInactive: (val: boolean) => {},
  setFilterByType: (val: string) => {},
  setChainIds: (val: string[]) => {},
  debouncedChangeHandler: (val: React.ChangeEvent<HTMLInputElement>) => {},
});

export default PythiaDataContext;
