import { Chain } from 'Interfaces/chain';
import { SubscriptionData } from 'Interfaces/subscription';
import { createContext } from 'react';

interface PythiaDataContextInterface {
  subs: SubscriptionData;
  isSubsLoading: boolean;
  fetchSubs: (page: number, size?: number) => void;
  chains: Chain[];
  isChainsLoading: boolean;
  fetchBalance: (chainId: BigInt | number, address: string) => void;
  balance: number;
  isBalanceLoading: boolean;
  pma: string;
  deposit: (chainId: string, hash: string) => Promise<any>;
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
  fetchSubs: () => {},
  chains: [],
  isChainsLoading: false,
  fetchBalance: () => {},
  balance: 0,
  isBalanceLoading: false,
  pma: '',
  deposit: () => Promise.resolve(),
});

export default PythiaDataContext;
