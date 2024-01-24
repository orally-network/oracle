import { Card, Flex, Layout, Space, Typography } from 'antd';
import React from 'react';
import { Actions } from './Actions';
import { WeatherWidget } from './WeatherWidget';
import { PredictWidget } from './PredictWidget';
import { WinnersTable } from './WinnersTable';
import { TodayBidsTable } from './TodayBidsTable';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';

export const Demo = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;

  return (
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
            <Card>
              <Typography.Paragraph>Today’s prize pool: 0.1ETH</Typography.Paragraph>
              <Typography.Title level={4}>1 ticket costs 0.001 ETH</Typography.Title>
            </Card>
            <Card title="Today’s bids" style={{ flex: 1 }}>
              <TodayBidsTable />
            </Card>
          </Flex>
        </Flex>
        <Card title="Previous Winners">
          <WinnersTable />
        </Card>
      </Space>
    </Layout.Content>
  );
};
