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
import { ExportOutlined } from '@ant-design/icons';
import IconLink from 'Components/IconLink';
import { truncateEthAddress } from 'Utils/addressUtils';

export const WeatherAuction = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;

  return (
    <WeatherAuctionProvider>
      <Layout.Content className='weather-auction'>
        <Space size="middle" direction="vertical" style={{ width: '100%', position: 'relative' }}>
          <Flex align="center" justify="space-between" gap={8}>
            <Typography.Title style={{ minWidth: '70px' }} level={3}>
              Weather Prediction ({truncateEthAddress("0x8B2B8E6e8bF338e6071E6Def286B8518B7BFF7F1")})
              {' '}
              <IconLink
                link="https://arbiscan.io/address/0x8B2B8E6e8bF338e6071E6Def286B8518B7BFF7F1"
                IconComponent={ExportOutlined}
              />
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
