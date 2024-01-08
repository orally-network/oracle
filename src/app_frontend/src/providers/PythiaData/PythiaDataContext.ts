import { FilterType } from 'Interfaces/subscription';
import { createContext } from 'react';

interface PythiaDataContextInterface {
  fetchBalance: (chainId: BigInt | number, address: string) => void;
  balance: number;
  isBalanceLoading: boolean;
  pma: string;
  deposit: (chainId: string, hash: string) => Promise<any>;

  page: number;
  setPage: (val: number) => void;
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
  fetchBalance: () => {},
  balance: 0,
  isBalanceLoading: false,
  pma: '',
  deposit: () => Promise.resolve(),

  page: 1,
  setPage: (val: number) => {},
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
