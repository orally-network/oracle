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
  createFeed: (feed: FeedRequest) => Promise<any>;
}

const SybilFeedsContext = createContext<SybilFeedsContextInterface>({
  page: 1,
  feedType: 'Default',
  showMine: false,
  searchQuery: '',
  setPage: () => {},
  setSearchQuery: () => {},
  setShowMine: () => {},
  setFeedType: () => {},
  debouncedChangeHandler: () => {},
  createFeed: () => Promise.resolve(),
});

export default SybilFeedsContext;
