import { Chain } from 'Interfaces/chain';
import { Subscription } from 'Interfaces/subscription';
import { createContext } from 'react';

interface PythiaDataContextInterface {
  subs: Subscription[],
  isSubsLoading: boolean,
  fetchSubs: () => void,
  chains: Chain[],
  isChainsLoading: boolean,
  fetchBalance: () => void,
  balance: number,
  isBalanceLoading: boolean,
  pma: string,
  deposit: () => void,
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
  deposit: () => {},
});

export default PythiaDataContext;
