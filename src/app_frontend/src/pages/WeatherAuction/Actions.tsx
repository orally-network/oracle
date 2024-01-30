import React from 'react';
import styles from './WeatherAuction.scss';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { Flex } from 'antd';
import Button from 'Components/Button';

export const Actions = () => {
  const { withdraw, userWinningBalance } = useWeatherData();

  return (
    <Flex align="center" gap="small">
      <Flex vertical>
        <span>My winnings</span>
        <span className={styles.accentText}>{userWinningBalance} ETH</span>
      </Flex>
      <Button type="primary" onClick={withdraw} disabled={userWinningBalance === 0}>
        Withdraw
      </Button>
    </Flex>
  );
};
