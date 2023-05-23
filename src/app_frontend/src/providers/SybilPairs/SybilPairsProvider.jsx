import React, { useEffect, useState, useMemo } from 'react';

import sybilCanister from 'Pages/Sybil/sybilCanister';
import SybilPairsContext from './SybilPairsContext';

const SybilPairsProvider = ({ children }) => {
  const [pairs, setPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchPairs = async () => {
      setIsLoading(true);
      
      const pairs = await sybilCanister.get_pairs();
      
      console.log({ pairs });
      
      setPairs(pairs);
      setIsLoading(false);
    };

    fetchPairs();
  }, []);
  
  const value = useMemo(() => {
    return {
      pairs,
      isLoading,
    };
  }, [pairs, isLoading]);
  
  return (
    <SybilPairsContext.Provider value={value}>
      {children}
    </SybilPairsContext.Provider>
  );
};

export default SybilPairsProvider;
