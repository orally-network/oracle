import React, { useState } from 'react';
import { ApolloDataContext } from './ApolloContext';

export const ApolloDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = useState<number>(1);
  const value = {
    items: [],
    page,
    setPage,
  };
  return <ApolloDataContext.Provider value={value}>{children}</ApolloDataContext.Provider>;
};
