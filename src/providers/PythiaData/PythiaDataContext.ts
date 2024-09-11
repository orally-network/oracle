import { FilterType } from 'Interfaces/subscription';
import { createContext } from 'react';

interface PythiaDataContextInterface {
  fetchBalance: (chainId: bigint | number, address: string) => void;
  balance: number;
  isBalanceLoading: boolean;
  pma: `0x${string}`;
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
  setPage: () => {},
  filterByType: 'Empty',
  showMine: false,
  showInactive: false,
  chainIds: [] as string[],
  searchQuery: '',
  setSearchQuery: () => {},
  setShowMine: () => {},
  setShowInactive: () => {},
  setFilterByType: () => {},
  setChainIds: () => {},
  debouncedChangeHandler: () => {},
});

export default PythiaDataContext;
