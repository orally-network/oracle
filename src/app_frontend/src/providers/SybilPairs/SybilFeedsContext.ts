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
});

export default SybilFeedsContext;
