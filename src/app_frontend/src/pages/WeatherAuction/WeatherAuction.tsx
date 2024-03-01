import { Card, Flex, Layout, Space, Typography } from 'antd';
import { useParams, Navigate } from 'react-router-dom';
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
import { predictionsMap } from 'Constants/predictions';
import ROUTES from 'Constants/routes';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';

export const WeatherAuction = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;
  const { predictionChainId } = useWeatherData();
  const { city } = useParams();

  if (!city || !predictionsMap[city]) {
    return <Navigate to={`/${ROUTES.WEATHER_PREDICTION}/denver`} replace />;
  }

  return (
    <WeatherAuctionProvider>
      <Layout.Content className="weather-auction">
        <Space size="middle" direction="vertical" style={{ width: '100%', position: 'relative' }}>
          <Flex align="center" justify="space-between" gap={8}>
            <Typography.Title style={{ minWidth: '70px' }} level={3}>
              Weather Prediction (
              {truncateEthAddress(predictionsMap[city].contract[predictionChainId])}){' '}
              <IconLink
                link={`https://arbiscan.io/address/${predictionsMap[city].contract[predictionChainId]}`}
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
