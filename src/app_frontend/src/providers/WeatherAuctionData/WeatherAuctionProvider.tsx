import React, { useEffect } from 'react';
import { WeatherAuctionContext } from './WeatherAuctionContext';
import { useQuery } from '@apollo/client';
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
  const { loading, error, data } = useQuery(GET_BIDS);
  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { chain: currentChain } = useNetwork();

  const weatherAuctionContract = {
    address: WEATHER_AUCTION_ADDRESS,
    abi: WeatherAuctionABI,
  };

  const sendAuctionData = async (temp: number, ticketAmount: number) => {
    // TODO: should check balance before sending transaction
    // open top up?
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

  const getTotalPrize = async () => {
    try {
      const data = await readContracts({
        contracts: [
          {
            ...weatherAuctionContract,
            functionName: 'totalTickets', // then multiply it for TICKET_PRICE and it'll be today's prize
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
      // TODO: parse data
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

  const value = {
    winners: data ? data.winnerDeclareds : [],
    bids: data ? data.bidPlaceds : [],
    isWinnersLoading: loading,
    getTotalPrize,
    sendAuctionData,
  };
  return <WeatherAuctionContext.Provider value={value}>{children}</WeatherAuctionContext.Provider>;
};
