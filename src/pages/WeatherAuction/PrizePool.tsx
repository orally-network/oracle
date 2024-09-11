import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { Card, Typography } from 'antd';
import React from 'react';

export const PrizePool = () => {
  const { prize, ethRate, ticketPrice } = useWeatherData();

  const prizeUsd = ethRate ? prize * ethRate : null;

  return (
    <Card>
      <Typography.Paragraph>
        Today’s prize pool: {prize.toFixed(4)} ETH
        {prizeUsd ? <Typography.Text> (${prizeUsd?.toFixed(2)})</Typography.Text> : null}
      </Typography.Paragraph>
      <Typography.Title level={4}>
        1 ticket costs {ticketPrice} ETH{' '}
        {ethRate ? `($${(ethRate * ticketPrice).toFixed(2)})` : null}
      </Typography.Title>
    </Card>
  );
};
