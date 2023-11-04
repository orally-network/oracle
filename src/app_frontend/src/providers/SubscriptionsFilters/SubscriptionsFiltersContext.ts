import { createContext } from 'react';
import { FilterType } from 'Interfaces/subscription';

interface SubscriptionsFiltersContextInterface {
  filterByType: FilterType;
  showMine: boolean;
  chainIds: string[];
  setShowMine: (val: boolean) => void;
  setFilterByType: (val: string) => void;
  setChainIds: (val: string[]) => void;
  debouncedChangeHandler: (val: React.ChangeEvent<HTMLInputElement>) => void;
}

const SubscriptionsFiltersContext= createContext<SubscriptionsFiltersContextInterface>({
  filterByType: 'all',
  showMine: false,
  chainIds: [] as string[],
  setShowMine: (val: boolean) => {},
  setFilterByType: (val: string) => {},
  setChainIds: (val: string[]) => {},
  debouncedChangeHandler: (val: React.ChangeEvent<HTMLInputElement>) => {},
});

export default SubscriptionsFiltersContext;
