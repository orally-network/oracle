import { Card, Flex, Layout, Space, Spin, Typography } from 'antd';
import React, { useEffect } from 'react';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { WeatherAuctionProvider } from 'Providers/WeatherAuctionData/WeatherAuctionProvider';
import { ExportOutlined } from '@ant-design/icons';
import IconLink from 'Components/IconLink';
import { truncateEthAddress } from 'Utils/addressUtils';
import { Actions } from 'Pages/WeatherAuction/Actions';
import { TodayBidsTable } from 'Pages/WeatherAuction/TodayBidsTable';
import { WinnersTable } from 'Pages/WeatherAuction/WinnersTable';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { useParams } from 'react-router-dom';
import styles from './WeatherDayDetails.scss';
import { utils } from 'ethers';

export const WeatherDayDetails = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;
  const { day } = useParams();

  const { setDay, winners, isWinnersLoading } = useWeatherData();

  const winner = winners.find((winner) => winner.day === day);

  console.log('winner', winner);

  useEffect(() => {
    if (day !== undefined) {
      setDay(Number(day));
    }
  }, []);

  return (
    <Layout.Content className="weather-auction">
      <Space size="middle" direction="vertical" style={{ width: '100%', position: 'relative' }}>
        <Flex align="center" justify="space-between" gap={8}>
          <Typography.Title style={{ minWidth: '70px' }} level={3}>
            Weather Prediction ({truncateEthAddress('0x8B2B8E6e8bF338e6071E6Def286B8518B7BFF7F1')}){' '}
            <IconLink
              link="https://arbiscan.io/address/0x8B2B8E6e8bF338e6071E6Def286B8518B7BFF7F1"
              IconComponent={ExportOutlined}
            />
          </Typography.Title>
          <Actions />
        </Flex>

        <Flex gap="middle" vertical={isMobile}>
          <Flex
            gap="middle"
            style={{
              flex: 1,
            }}
          >
            <Card
              style={{
                flex: 1,
                height: 177,
              }}
            >
              Day
              <Flex justify="center" align="center">
                <div className={styles.bigFont}>{day}</div>
              </Flex>
            </Card>
            <Card
              style={{
                flex: 1,
                height: 177,
              }}
            >
              Prize
              <Flex justify="center" align="center">
                <div className={styles.bigFont}>
                  {Number(utils.formatEther(winner?.winnerPrize || 0)).toFixed(4)}
                </div>
              </Flex>
            </Card>
          </Flex>
          <Flex
            gap="middle"
            style={{
              flex: 1,
            }}
          >
            <Card
              style={{
                flex: 1,
                height: 177,
              }}
            >
              Bid Temperature
              <Flex justify="center" align="center">
                <div className={styles.bigFont}>
                  {isWinnersLoading ? (
                    <Spin />
                  ) : winner && winner.temperature ? (
                    Number(winner.temperature) / 10
                  ) : (
                    0
                  )}
                  <span>℃</span>
                </div>
              </Flex>
            </Card>
            <Card
              style={{
                flex: 1,
                height: 177,
              }}
            >
              Real Temperature
            </Card>
          </Flex>
        </Flex>

        <Flex gap="middle" vertical={isMobile}>
          <TodayBidsTable isTable={true} title={'Bids'} />
          <WinnersTable pageSize={8} day={day} title={'Winners'} />
        </Flex>
      </Space>
    </Layout.Content>
  );
};

export const WeatherDayDetailsWrapper = () => {
  return (
    <WeatherAuctionProvider>
      <WeatherDayDetails />
    </WeatherAuctionProvider>
  );
};
