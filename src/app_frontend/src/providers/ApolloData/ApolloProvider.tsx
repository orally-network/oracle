import React from 'react';
import { ApolloDataContext } from './ApolloContext';

export const WeatherAuctionProvider = ({ children }: { children: React.ReactNode }) => {
  const value = {
    items: [],
  };
  return <ApolloDataContext.Provider value={value}>{children}</ApolloDataContext.Provider>;
};
