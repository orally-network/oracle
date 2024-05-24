import { formatUnits, parseUnits, formatEther } from 'viem';
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { WeatherAuctionContext } from './WeatherAuctionContext';
import { useLazyQuery } from '@apollo/client';
import { GET_BIDS } from './queries/auction';
import { writeContract, readContract } from 'wagmi/actions';
import WeatherAuctionABI from './WeatherAuctionABI.json';
import WeatherPredictionV2ABI from './WeatherPredictionV2ABI.json';
import { CHAINS_MAP } from 'Constants/chains';
import { useAccount, useSwitchChain, useConfig } from 'wagmi';
import { toast } from 'react-toastify';
import { useGetSybilFeeds } from 'ApiHooks/useGetSybilFeeds';
import { DEFAULT_FEEDS_SIZE } from 'Constants/ui';
import { Winner } from 'Interfaces/weather';
import { predictionsMap } from 'Constants/predictions';
import { ARBITRUM_CHAIN_ID, TICKET_PRICE } from './contants';

export const WeatherAuctionProvider = ({ children }: { children: React.ReactNode }) => {
  const { city } = useParams();
  const config = useConfig();
  const prediction = city ? predictionsMap[city] : predictionsMap.denver;

  const [ticketPrice, setTicketPrice] = useState(TICKET_PRICE);
  const [predictionChainId, setPredictionChainId] = useState(ARBITRUM_CHAIN_ID);
  const [getBids, { loading, data: bidsData }] = useLazyQuery(GET_BIDS);
  const { address, chain: currentChain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [isAuctionOpen, setIsAuctionOpen] = useState<boolean | null>(null);
  const [userWinningBalance, setUserWinningBalance] = useState<number>(0);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [prize, setPrize] = useState(0);
  const [day, setDay] = useState<number | null>(null); // day for which we are fetching bids for details page

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
  const ethRate = rate ? formatUnits(rate, decimals) : null;

  const weatherAuctionContract = {
    address: prediction.contract[predictionChainId],
    abi: prediction.version === 'v1' ? WeatherAuctionABI : WeatherPredictionV2ABI,
  };

  const sendAuctionData = async (temp: number, ticketAmount: number) => {
    const res = await writeContract(config, {
      ...weatherAuctionContract,
      value: parseUnits(
        String(ticketPrice * (ticketAmount ? +ticketAmount : 1)),
        CHAINS_MAP[predictionChainId].nativeCurrency.decimals
      ), // amount of eth applied to transaction
      functionName: 'bid',
      args: [temp], // in format with decimals=1, e.g. 16.6C = 166
      chainId: predictionChainId,
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
        writeContract(config, {
          ...weatherAuctionContract,
          functionName: 'withdraw',
          chainId: predictionChainId,
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

      const userBalance = await readContract(config, {
        ...weatherAuctionContract,
        functionName: 'userBalances',
        args: [address],
        chainId: predictionChainId,
      });

      if (!userBalance && Number(userBalance) !== 0) {
        setUserWinningBalance(0);
        throw new Error(`No balance found for ${address}:${userBalance}`);
      } else {
        setUserWinningBalance(+formatEther(userBalance));
      }
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const getAuctionStatusAndDay = async () => {
    try {
      const auctionOpen = await readContract(config, {
        ...weatherAuctionContract,
        functionName: 'auctionOpen',
        chainId: predictionChainId,
      });

      const currentDay = await readContract(config, {
        ...weatherAuctionContract,
        functionName: 'currentDay',
        chainId: predictionChainId,
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
      const data = await readContract(config, {
        ...weatherAuctionContract,
        functionName: 'totalTickets',
        chainId: predictionChainId,
      });
      console.log({ data });

      setPrize(Number(data) * ticketPrice);
      return data;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const getTicketPrice = async () => {
    try {
      if (prediction.version === 'v1') {
        return;
      }

      const data = await readContract(config, {
        ...weatherAuctionContract,
        functionName: 'ticketPrice',
        chainId: predictionChainId,
      });
      console.log({ Ticket: data });

      setTicketPrice(Number(formatEther(data)));
      return data;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  useEffect(() => {
    if (currentChain?.id !== predictionChainId && switchChain) {
      switchChain({ chainId: predictionChainId });
    }
  }, [currentChain?.id, switchChain]);

  useEffect(() => {
    getAuctionStatusAndDay();
    getUserBalances();
    getTotalPrize();
    getTicketPrice();
  }, [currentDay]);

  useEffect(() => {
    if (isAuctionOpen !== null) {
      getBids({ variables: { day: day ?? currentDay, contract: prediction.contract[predictionChainId] } });
    }
  }, [isAuctionOpen, day]);

  const winners: Winner[] = useMemo(() => {
    if (!bidsData) {
      return [];
    } else if (!ethRate) {
      return bidsData.winnerDeclareds;
    }

    return bidsData.winnerDeclareds.map((winner: Winner) => {
      const eth = Number(formatEther(winner.winnerPrize)).toFixed(4);

      return {
        ...winner,
        winnerPrizeLabel: `${eth} ($${(Number(eth) * Number(ethRate)).toFixed(2)})`,
      };
    });
  }, [bidsData, ethRate]);

  console.log({ predictionChainId });

  const value = {
    winners,
    bids: bidsData ? [...newBids, ...bidsData.bidPlaceds] : [],
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
    setDay,
    ethRate: Number(ethRate),
    prediction,
    predictionChainId,
    ticketPrice,
  };
  return <WeatherAuctionContext.Provider value={value}>{children}</WeatherAuctionContext.Provider>;
};
