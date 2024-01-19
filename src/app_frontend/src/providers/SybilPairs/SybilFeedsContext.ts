import { AddressData } from 'Interfaces/common';
import { FilterFeedType } from 'Interfaces/feed';
import { createContext } from 'react';

interface SybilFeedsContextInterface {
  page: number;
  feedType: FilterFeedType;
  showMine: boolean;
  searchQuery: string;
  setPage: (val: number) => void;
  setSearchQuery: (val: string) => void;
  setShowMine: (val: boolean) => void;
  setFeedType: (val: FilterFeedType) => void;
  debouncedChangeHandler: (val: React.ChangeEvent<HTMLInputElement>) => void;
  deposit: (hash: string, addressData: AddressData) => Promise<any>;
  fetchBalance: (addressData: AddressData) => Promise<any>;
  isBalanceLoading: boolean;
}

const SybilFeedsContext = createContext<SybilFeedsContextInterface>({
  page: 1,
  feedType: 'Default',
  showMine: false,
  searchQuery: '',
  setPage: (val: number) => {},
  setSearchQuery: (val: string) => {},
  setShowMine: (val: boolean) => {},
  setFeedType: (val: FilterFeedType) => {},
  debouncedChangeHandler: (val: React.ChangeEvent<HTMLInputElement>) => {},
  deposit: () => Promise.resolve(),
  fetchBalance: () => Promise.resolve(),
  isBalanceLoading: false,
});

export default SybilFeedsContext;
