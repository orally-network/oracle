import { ApolloInstance } from 'Interfaces/apollo';
import { createContext } from 'react';

export type ApolloData = {
  items: ApolloInstance[];
  page: number;
  setPage: (page: number) => void;
};

export const ApolloDataContext = createContext<ApolloData>({
  items: [],
  page: 1,
  setPage: () => {},
});
