import { createContext } from 'react';

const PythiaDataContext = createContext({
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
