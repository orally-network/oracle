import { Card, Flex, Layout, Space, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
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
import { fetchTransaction } from '@wagmi/core';

export const WeatherDayDetails = () => {
  const [actualTemperature, setActualTemperature] = useState<number>(0);
  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;
  const { day } = useParams();

  const { setDay, winners, isWinnersLoading, ethRate } = useWeatherData();

  const dayWinners = winners.filter((winner) => winner.day === day);

  const dayPrize =
    dayWinners.length > 0
      ? dayWinners.reduce(
          (acc, currentValue) => acc + +utils.formatEther(currentValue.winnerPrize),
          0
        )
      : 0;
  console.log({ dayWinners });

  useEffect(() => {
    if (day !== undefined) {
      setDay(Number(day));
    }
  }, []);

  useEffect(() => {
    const asyncFn = async () => {
      const tx = await fetchTransaction({
        hash: dayWinners[0]?.transactionHash,
      });

      console.log({ tx });

      const multicallInterface = new utils.Interface([
        'function multicall((address,bytes,uint256)[])',
      ]);

      const decodedMulticallInput = multicallInterface.decodeFunctionData('multicall', tx.input);

      console.log({ res: decodedMulticallInput?.[0]?.[0]?.[1] });

      const callDataInterface = new utils.Interface([
        'function updateTemperature(string, uint256, uint256, uint256)',
      ]);

      const decodedCallData = callDataInterface.decodeFunctionData(
        'updateTemperature',
        decodedMulticallInput?.[0]?.[0]?.[1]
      );

      console.log({ resCallData: decodedCallData });

      console.log({ actualTemp: Number(decodedCallData[1]) });

      setActualTemperature(Number(decodedCallData[1]));
    };
    if (dayWinners.length > 0) {
      asyncFn();
    }
  }, [dayWinners.length]);

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
                height: 177,
                minWidth: isMobile ? '50%' : '200px',
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
                maxWidth: isMobile ? '50%' : '100%',
              }}
            >
              Prize
              <Flex justify="center" align="center" vertical>
                {isWinnersLoading ? (
                  <Spin />
                ) : (
                  <>
                    <div className={styles.bigFont}>
                      {dayWinners.length && dayPrize ? dayPrize.toFixed(4) : 0}
                      <span> ETH</span>
                    </div>
                    <div>${ethRate && dayPrize ? dayPrize * ethRate : 0}</div>
                  </>
                )}
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
                maxWidth: '50%',
              }}
            >
              Bid Temperature
              <Flex justify="center" align="center">
                {isWinnersLoading ? (
                  <Spin />
                ) : (
                  // <Typography.Link
                  //   href={`https://arbiscan.io/tx/${dayWinners[0]?.transactionHash}#eventlog`}
                  // >
                  <div className={styles.bigFont}>
                    {dayWinners.length ? (
                      <>
                        {Number(dayWinners[0].temperature) / 10}
                        <span>℃</span>
                      </>
                    ) : (
                      0
                    )}
                  </div>
                  // </Typography.Link>
                )}
              </Flex>
            </Card>
            <Card
              style={{
                flex: 1,
                height: 177,
              }}
            >
              Actual Temperature
              {isWinnersLoading ? (
                <div>
                  <Spin />
                </div>
              ) : (
                <div className={styles.bigFont}>
                  {actualTemperature ? (
                    <>
                      {actualTemperature / 10}
                      <span>℃</span>
                    </>
                  ) : (
                    0
                  )}
                </div>
              )}
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
