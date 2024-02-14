import { useContext } from 'react';
import { ApolloDataContext } from './ApolloContext';

export const useWeatherData = () => useContext(ApolloDataContext);
