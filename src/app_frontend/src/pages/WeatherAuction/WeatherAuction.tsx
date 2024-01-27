import { Card, Flex, Layout, Space, Typography } from 'antd';
import React from 'react';
import { Actions } from './Actions';
import { WeatherWidget } from './WeatherWidget';
import { PredictWidget } from './PredictWidget';
import { WinnersTable } from './WinnersTable';
import { TodayBidsTable } from './TodayBidsTable';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { WeatherAuctionProvider } from 'Providers/WeatherAuctionData/WeatherAuctionProvider';
import { PrizePool } from './PrizePool';

export const WeatherAuction = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;

  return (
    <WeatherAuctionProvider>
      <Layout.Content>
        <Space size="middle" direction="vertical" style={{ width: '100%', position: 'relative' }}>
          <Flex align="center" justify="space-between" gap={8}>
            <Typography.Title style={{ minWidth: '70px' }} level={3}>
              Weather Auction
            </Typography.Title>
            <Actions />
          </Flex>
          <Flex gap="middle" vertical={isMobile}>
            <Flex gap="middle" vertical>
              <WeatherWidget />
              <PredictWidget />
            </Flex>
            <Flex gap="middle" vertical style={{ width: '100%' }}>
              <PrizePool />
              <TodayBidsTable />
            </Flex>
          </Flex>
          <WinnersTable />
        </Space>
      </Layout.Content>
    </WeatherAuctionProvider>
  );
};
