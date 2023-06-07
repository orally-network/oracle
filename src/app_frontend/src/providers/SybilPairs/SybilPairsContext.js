import { createContext } from 'react';

const SybilPairsContext = createContext({
    pairs: [],
    isLoading: false,
});

export default SybilPairsContext;
