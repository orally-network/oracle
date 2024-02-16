import React, { useEffect, useState, useMemo } from 'react';
import { WeatherAuctionContext } from './WeatherAuctionContext';
import { useLazyQuery } from '@apollo/client';
import { GET_BIDS } from './queries/auction';
import { writeContract, readContract } from '@wagmi/core';
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
  const [isAuctionOpen, setIsAuctionOpen] = useState<boolean | null>(null);
  const [userWinningBalance, setUserWinningBalance] = useState<number>(0);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [prize, setPrize] = useState(0);

  const [newBids, setNewBids] = useState<any[]>([]);

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
    const res = await writeContract({
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

    console.log({ res });

    setNewBids((current) => [
      ...current,
      {
        bidder: address?.toLowerCase(),
        day: currentDay,
        id: 'NA' + Date.now(),
        temperatureGuess: temp,
        ticketCount: ticketAmount ? +ticketAmount : 1,
        transactionHash: 'NA' + Date.now(),
      },
    ]);
    getTotalPrize();
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
      if (!address) return;

      const userBalance = await readContract({
        ...weatherAuctionContract,
        functionName: 'userBalances',
        args: [address],
        chainId: ARBITRUM_CHAIN_ID,
      });

      if (!userBalance) {
        setUserWinningBalance(0);
        throw new Error(`No balance found for ${address}:${userBalance}`);
      } else {
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

      setPrize(Number(data) * TICKET_PRICE);
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
    getUserBalances();
    getTotalPrize();
  }, [currentDay]);

  useEffect(() => {
    if (isAuctionOpen !== null) {
      getBids({ variables: { day: currentDay } });
    }
  }, [isAuctionOpen]);

  console.log(data?.winnerDeclareds);

  const winners = useMemo(() => {
    if (!data) {
      return [];
    } else if (!ethRate) {
      return data.winnerDeclareds;
    }

    return data.winnerDeclareds.map((winner) => {
      const eth = utils.formatEther(winner.winnerPrize);

      return {
        ...winner,
        winnerPrizeLabel: `${eth} ($${(eth * ethRate).toFixed(2)})`,
      };
    });
  }, [data, ethRate]);

  const value = {
    winners,
    bids: data ? [...newBids, ...data.bidPlaceds] : [],
    isWinnersLoading: loading,
    getTotalPrize,
    prize,
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
