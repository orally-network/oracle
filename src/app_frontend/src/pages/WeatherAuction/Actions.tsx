import { Button, Flex } from 'antd';
import React from 'react';
import styles from './WeatherAuction.scss';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';

export const Actions = () => {
  const { withdraw, userWinningBalance } = useWeatherData();

  return (
    <Flex align="center" gap="small">
      <Flex vertical>
        <span>My winnings</span>
        <span className={styles.accentText}>{userWinningBalance} ETH</span>
      </Flex>
      <Button type="primary" onClick={withdraw}>
        Withdraw
      </Button>
    </Flex>
  );
};
