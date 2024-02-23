import { WriteContractResult } from '@wagmi/core';
import { Bidder, Winner } from 'Interfaces/weather';
import { createContext } from 'react';

export type WeatherData = {
  winners: Winner[];
  bids: Bidder[];
  isWinnersLoading: boolean;
  sendAuctionData: (temp: number, amount: number) => Promise<void>;
  getTotalPrize: () => Promise<WriteContractResult>;
  prize: number;
  isAuctionOpen: boolean | null;
  getBids: (vars: any) => void;
  withdraw: () => Promise<WriteContractResult>;
  userWinningBalance: number;
  currentDay: number;
  setDay: (day: number) => void;
  ethRate: number;
};

export const WeatherAuctionContext = createContext<WeatherData>({
  winners: [],
  bids: [],
  isWinnersLoading: false,
  sendAuctionData: async () => Promise.resolve(),
  getTotalPrize: async () => Promise.resolve({} as WriteContractResult),
  prize: 0,
  isAuctionOpen: false,
  getBids: (vars) => {},
  withdraw: () => Promise.resolve({} as WriteContractResult),
  userWinningBalance: 0,
  currentDay: 0,
  setDay: (day: number) => {},
  ethRate: 0,
});
