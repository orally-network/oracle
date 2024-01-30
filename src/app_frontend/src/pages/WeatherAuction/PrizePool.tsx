import { TICKET_PRICE } from 'Providers/WeatherAuctionData/WeatherAuctionProvider';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { Card, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

export const PrizePool = () => {
  const { getTotalPrize } = useWeatherData();
  const [prize, setPrize] = useState(0);

  //TODO: add ticket cost from data or ?

  useEffect(() => {
    const getPools = async () => {
      const data = await getTotalPrize();
      console.log(data[0].result);
      setPrize(Number(data[0].result) * TICKET_PRICE);
    };
    getPools();
  }, []);
  return (
    <Card>
      <Typography.Paragraph>Today’s prize pool: {prize.toFixed(4)} ETH</Typography.Paragraph>
      <Typography.Title level={4}>1 ticket costs {TICKET_PRICE} ETH</Typography.Title>
    </Card>
  );
};
