import { createContext } from 'react';

const PythiaDataContext = createContext({
    subs: [],
    isSubsLoading: false,
    fetchSubs: () => {},
    chains: [],
    isChainsLoading: false,
});

export default PythiaDataContext;
