import React, { useEffect, useState } from 'react';
import { WeatherAuctionContext } from './WeatherAuctionContext';
import { useLazyQuery } from '@apollo/client';
import { GET_BIDS } from './queries/auction';
import { readContracts, writeContract } from '@wagmi/core';
import WeatherAuctionABI from './weatherAuctionABI.json';
import { utils } from 'ethers';
import { CHAINS_MAP } from 'Constants/chains';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

export const WEATHER_AUCTION_ADDRESS = '0x8B2B8E6e8bF338e6071E6Def286B8518B7BFF7F1';
export const TICKET_PRICE = 0.001;
export const ARBITRUM_CHAIN_ID = 42161;

export const WeatherAuctionProvider = ({ children }: { children: React.ReactNode }) => {
  const [getBids, { loading, error, data }] = useLazyQuery(GET_BIDS);
  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { chain: currentChain } = useNetwork();
  const [isAuctionOpen, setIsAuctionOpen] = useState<boolean>(false);
  const [userWinningBalance, setUserWinningBalance] = useState<number>(0);
  const [currentDay, setCurrentDay] = useState<number>(0);

  const weatherAuctionContract = {
    address: WEATHER_AUCTION_ADDRESS,
    abi: WeatherAuctionABI,
  };

  const sendAuctionData = async (temp: number, ticketAmount: number) => {
    return writeContract({
      address: WEATHER_AUCTION_ADDRESS,
      abi: WeatherAuctionABI,
      value: utils.parseUnits(
        String(TICKET_PRICE * (ticketAmount ? +ticketAmount : 1)),
        CHAINS_MAP[ARBITRUM_CHAIN_ID].nativeCurrency.decimals
      ), // amount of eth applied to transaction
      functionName: 'bid',
      args: [temp], // in format with decimals=1, e.g. 16.6C = 166
      chainId: ARBITRUM_CHAIN_ID,
    });
  };

  const withdraw = async () => {
    return writeContract({
      address: WEATHER_AUCTION_ADDRESS,
      abi: WeatherAuctionABI,
      functionName: 'withdraw',
      chainId: ARBITRUM_CHAIN_ID,
    });
  };

  const getUserBalances = async () => {
    try {
      const data = await readContracts({
        contracts: [
          {
            ...weatherAuctionContract,
            functionName: 'userBalances',
            args: [address],
          },
        ],
      });
      setUserWinningBalance(utils.formatEther((data[0]?.result)));
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const getAuctionStatusAndDay = async () => {
    try {
      const data = await readContracts({
        contracts: [
          {
            ...weatherAuctionContract,
            functionName: 'auctionOpen',
          },
          {
            ...weatherAuctionContract,
            functionName: 'currentDay',
          },
        ],
      });
      setIsAuctionOpen(data[0]?.result as boolean);
      setCurrentDay(Number(data[1]?.result));
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const getTotalPrize = async () => {
    try {
      const data = await readContracts({
        contracts: [
          {
            ...weatherAuctionContract,
            functionName: 'totalTickets',
          },
          address
            ? {
                ...weatherAuctionContract,
                functionName: 'userBalances',
                args: [address],
              }
            : null,
        ],
      });
      console.log({ data });
      return data;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  useEffect(() => {
    if (currentChain?.id !== ARBITRUM_CHAIN_ID && switchNetwork) {
      switchNetwork(ARBITRUM_CHAIN_ID);
    }
  }, [currentChain?.id, switchNetwork]);

  useEffect(() => {
    getAuctionStatusAndDay();
    getBids({ variables: { day: currentDay } });
    getUserBalances();
  }, [currentDay]);

  const value = {
    winners: data ? data.winnerDeclareds : [],
    bids: data ? data.bidPlaceds : [],
    isWinnersLoading: loading,
    getTotalPrize,
    sendAuctionData,
    isAuctionOpen,
    getBids,
    withdraw,
    getUserBalances,
    userWinningBalance,
  };
  return <WeatherAuctionContext.Provider value={value}>{children}</WeatherAuctionContext.Provider>;
};
