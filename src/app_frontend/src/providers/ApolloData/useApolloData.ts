import { useContext } from 'react';
import { ApolloDataContext } from './ApolloContext';

export const useApolloData = () => useContext(ApolloDataContext);
