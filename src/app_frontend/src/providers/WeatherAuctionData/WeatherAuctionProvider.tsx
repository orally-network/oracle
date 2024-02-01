import React, { useEffect, useState, useMemo } from 'react';
import { WeatherAuctionContext } from './WeatherAuctionContext';
import { useLazyQuery } from '@apollo/client';
import { GET_BIDS } from './queries/auction';
import { readContracts, writeContract, readContract } from '@wagmi/core';
import WeatherAuctionABI from './weatherAuctionABI.json';
import { utils } from 'ethers';
import { CHAINS_MAP } from 'Constants/chains';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { toast } from 'react-toastify';
import { useGetSybilFeeds } from 'ApiHooks/useGetSybilFeeds';
import { DEFAULT_FEEDS_SIZE } from 'Constants/ui';

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

  const feedsData = useGetSybilFeeds({
    page: 1,
    size: DEFAULT_FEEDS_SIZE,
    filters: {
      owner: [],
      search: ['ETH/USD'],
      feed_type: [],
    },
  });
  const { rate, decimals } = feedsData.data.items?.[0]?.data?.[0]?.data?.DefaultPriceFeed ?? {};
  const ethRate = rate ? utils.formatUnits(rate, decimals) : null;

  const weatherAuctionContract = {
    address: WEATHER_AUCTION_ADDRESS,
    abi: WeatherAuctionABI,
  };

  const sendAuctionData = async (temp: number, ticketAmount: number) => {
    return await writeContract({
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
    try {
      const res = await toast.promise(
        writeContract({
          address: WEATHER_AUCTION_ADDRESS,
          abi: WeatherAuctionABI,
          functionName: 'withdraw',
          chainId: ARBITRUM_CHAIN_ID,
        }),
        {
          pending: 'Withdrawing...',
          success: 'Withdrawn!',
          error: 'Error withdrawing',
        }
      );
      setUserWinningBalance(0);
      return res;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const getUserBalances = async () => {
    try {
      if (!address) return

      const data = await readContracts({
        contracts: [
          {
            ...weatherAuctionContract,
            functionName: 'userBalances',
            args: [address],
          },
        ],
      });

      if (data && data[0]?.status === 'failure') {
        setUserWinningBalance(0);
        throw new Error(data[0]?.error);
      } else {
        const userBalance: string = data[0]?.result;
        setUserWinningBalance(+utils.formatEther(userBalance));
      }
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const getAuctionStatusAndDay = async () => {
    try {
      const auctionOpen = await readContract({
        ...weatherAuctionContract,
        functionName: 'auctionOpen',
        chainId: ARBITRUM_CHAIN_ID,
      });

      const currentDay = await readContract({
        ...weatherAuctionContract,
        functionName: 'currentDay',
        chainId: ARBITRUM_CHAIN_ID,
      });

      setIsAuctionOpen(auctionOpen as boolean);
      setCurrentDay(Number(currentDay));
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const getTotalPrize = async () => {
    try {
      const data = await readContract({
        ...weatherAuctionContract,
        functionName: 'totalTickets',
        chainId: ARBITRUM_CHAIN_ID,
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
    // getUserBalances();
  }, [currentDay]);

  console.log(data?.winnerDeclareds);

  const winners = useMemo(() => {
    if (!data) {
      return [];
    } else if (!ethRate) {
      return data.winnerDeclareds;
    }

    return data.winnerDeclareds.map(winner => {
      const eth = utils.formatEther(winner.winnerPrize);

      return {
        ...winner,
        winnerPrizeLabel: `${eth} ($${(eth * ethRate).toFixed(2)})`,
      }
    });
  }, [data, ethRate]);

  const value = {
    winners,
    bids: data ? data.bidPlaceds : [],
    isWinnersLoading: loading,
    getTotalPrize,
    sendAuctionData,
    isAuctionOpen,
    getBids,
    withdraw,
    getUserBalances,
    userWinningBalance,
    currentDay,
    ethRate,
  };
  return <WeatherAuctionContext.Provider value={value}>{children}</WeatherAuctionContext.Provider>;
};
