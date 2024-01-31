import { WriteContractResult } from '@wagmi/core';
import { createContext } from 'react';

export type WeatherData = {
  winners: any[];
  bids: any[];
  isWinnersLoading: boolean;
  sendAuctionData: (temp: number, amount: number) => Promise<WriteContractResult>;
  getTotalPrize: () => Promise<WriteContractResult>;
  isAuctionOpen: boolean;
  getBids: (vars: any) => void;
  withdraw: () => Promise<WriteContractResult>;
  userWinningBalance: number;
  currentDay: number;
  ethRate: number,
};

export const WeatherAuctionContext = createContext<WeatherData>({
  winners: [],
  bids: [],
  isWinnersLoading: false,
  sendAuctionData: async () => Promise.resolve({} as WriteContractResult),
  getTotalPrize: async () => Promise.resolve({} as WriteContractResult),
  isAuctionOpen: false,
  getBids: (vars) => {},
  withdraw: () => Promise.resolve({} as WriteContractResult),
  userWinningBalance: 0,
  currentDay: 0,
  ethRate: 0,
});
