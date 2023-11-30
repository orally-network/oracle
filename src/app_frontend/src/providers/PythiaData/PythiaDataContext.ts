import { Chain } from 'Interfaces/chain';
import { Subscription } from 'Interfaces/subscription';
import { createContext } from 'react';

interface PythiaDataContextInterface {
  subs: Subscription[];
  isSubsLoading: boolean;
  fetchSubs: () => void;
  chains: Chain[];
  isChainsLoading: boolean;
  fetchBalance: (chainId: BigInt | number, address: string) => void;
  balance: number;
  isBalanceLoading: boolean;
  pma: string;
  deposit: (chainId: string, hash: string) => Promise<any>;
}

const PythiaDataContext = createContext<PythiaDataContextInterface>({
  subs: [],
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
