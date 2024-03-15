import { ApolloInstance } from 'Interfaces/apollo';
import { createContext } from 'react';

export type ApolloData = {
  items: ApolloInstance[];
  page: number;
  setPage: (page: number) => void;
  deposit: (chainId: string, hash: string) => Promise<any>;
  ama: `0x${string}`;
  fetchAma: (chainId: number) => Promise<void>;
};

export const ApolloDataContext = createContext<ApolloData>({
  items: [],
  page: 1,
  setPage: () => {},
  deposit: () => Promise.resolve(),
  ama: '0x',
  fetchAma: () => Promise.resolve(),
});

