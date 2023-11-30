import { createContext } from 'react';
import { FilterType } from 'Interfaces/subscription';

interface SubscriptionsFiltersContextInterface {
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

const SubscriptionsFiltersContext = createContext<SubscriptionsFiltersContextInterface>({
  filterByType: 'all',
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

export default SubscriptionsFiltersContext;
