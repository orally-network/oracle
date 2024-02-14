import { ApolloInstance } from 'Interfaces/apollo';
import { createContext } from 'react';

export type ApolloData = {
  items: ApolloInstance[];
};

export const ApolloDataContext = createContext<ApolloData>({
  items: [],
});
