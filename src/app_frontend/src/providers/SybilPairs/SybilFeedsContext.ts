import { AddressData } from 'Interfaces/common';
import { FeedRequest, FilterFeedType } from 'Interfaces/feed';
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
  createFeed: (feed: FeedRequest) => Promise<any>;
  fetchBalance: (addressData: AddressData) => Promise<any>;
  isBalanceLoading: boolean;
  readVerifyUnpacked: (signatureData: any) => Promise<any>;
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
  createFeed: () => Promise.resolve(),
  fetchBalance: () => Promise.resolve(),
  isBalanceLoading: false,
  readVerifyUnpacked: () => Promise.resolve(),
});

export default SybilFeedsContext;
