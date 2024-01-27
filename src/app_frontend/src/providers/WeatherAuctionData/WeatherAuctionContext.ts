import { WriteContractResult } from '@wagmi/core';
import { createContext } from 'react';

export type WeatherData = {
  winners: any[];
  bids: any[];
  isWinnersLoading: boolean;
  sendAuctionData: (temp: number, amount: number) => Promise<WriteContractResult>;
  getTotalPrize: () => Promise<WriteContractResult>;
};

export const WeatherAuctionContext = createContext<WeatherData>({
  winners: [],
  bids: [],
  isWinnersLoading: false,
  sendAuctionData: async () => Promise.resolve({} as WriteContractResult),
  getTotalPrize: async () => Promise.resolve({} as WriteContractResult),
});
