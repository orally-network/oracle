import { createContext } from 'react';

interface SybilFeedsContextInterface {
  page: number;
  setPage: (val: number) => void;
}

const SybilFeedsContext = createContext<SybilFeedsContextInterface>({
  page: 1,
  setPage: (val: number) => {},
});

export default SybilFeedsContext;
