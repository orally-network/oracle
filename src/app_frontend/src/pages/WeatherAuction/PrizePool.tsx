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
      setPrize(data[0].result);
    };
    getPools();
  }, []);
  return (
    <Card>
      <Typography.Paragraph>Today’s prize pool: {prize.toString()} ETH</Typography.Paragraph>
      <Typography.Title level={4}>1 ticket costs 0.001 ETH</Typography.Title>
    </Card>
  );
};
