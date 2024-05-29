import { useContext } from 'react';
import { WeatherAuctionContext } from './WeatherAuctionContext';

export const useWeatherData = () => useContext(WeatherAuctionContext);
