import React, { useState, useMemo } from 'react';

import SybilFeedsContext from './SybilFeedsContext';

const SybilFeedsProvider = ({ children }: any) => {
  const [page, setPage] = useState<number>(1);

  const value = useMemo(() => {
    return {
      page,
      setPage,
    };
  }, [page]);

  return <SybilFeedsContext.Provider value={value}>{children}</SybilFeedsContext.Provider>;
};

export default SybilFeedsProvider;
