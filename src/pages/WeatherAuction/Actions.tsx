import React from 'react';
import styles from './WeatherAuction.module.scss';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { Flex } from 'antd';
import Button from 'Components/Button';

export const Actions = () => {
  const { withdraw, userWinningBalance, ethRate } = useWeatherData();

  const balanceUsd = ethRate ? userWinningBalance * ethRate : null;

  return (
    <Flex align="center" gap="small">
      <Flex vertical>
        <span>My winnings</span>
        <span className={styles.accentText}>
          {userWinningBalance.toFixed(4)} ETH
          {balanceUsd ? ` ($${balanceUsd.toFixed(2)})` : null}
        </span>
      </Flex>
      <Button type="primary" onClick={withdraw} disabled={userWinningBalance === 0}>
        Withdraw
      </Button>
    </Flex>
  );
};
