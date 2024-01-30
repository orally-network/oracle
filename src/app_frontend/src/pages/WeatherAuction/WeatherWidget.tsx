import { Card, Flex, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './WeatherAuction.scss';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import { getWeatherIcon } from 'Utils/mapWeatherData';

export const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isWeatherDataLoading, setIsWeatherDataLoading] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;

  const fetchWeatherData = async () => {
    setIsWeatherDataLoading(true);
    try {
      const res = await fetch(
        'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/lisbon?unitGroup=metric&include=current&key=Y5447H4MUE2V3ERL33G7T7PX3&contentType=json'
      );
      // currentConditions.feelslike
      const data = await res.json();
      setWeatherData(data);
      return data;
    } catch (err) {
      console.error(err);
      try {
        const backupRes = await fetch(
          'https://api.openweathermap.org/data/3.0/onecall?lat=38.736946&lon=-9.142685&exclude=daily,hourly,minutely&appid=c048e977b95196479fc9142cfa01295a&units=metric'
        );
        // current.feels_like
        const backupData = await backupRes.json();
        setWeatherData(backupData);
        return backupRes;
      } catch (error) {
        console.error(error);
      }
    } finally {
      setIsWeatherDataLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const currentDate = new Date();
  const currentTemperature =
    isWeatherDataLoading || !weatherData
      ? 0
      : weatherData?.currentConditions?.temp || weatherData?.current?.temp;

  const weatherIcon = !weatherData
    ? 'clear-day'
    : weatherData?.currentConditions?.icon || getWeatherIcon(weatherData?.current);

  console.log({ weatherData });

  return (
    <Flex gap="middle">
      <Card
        style={{ width: '177', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Flex style={{ width: '104px', height: '104px' }} align="center" justify="center">
          {isWeatherDataLoading ? (
            <Spin />
          ) : (
            <img src={`weather/${weatherIcon}.svg`} alt="weather icon" />
          )}
        </Flex>
      </Card>
      <Card style={{ minWidth: isMobile ? 'auto' : 400 }}>
        <Flex gap={80}>
          <Flex vertical gap="large">
            <Typography.Title level={5}>Weather in Lisbon</Typography.Title>
            <Flex vertical>
              <span className={styles.label}>Date</span>
              <span className={styles.text}>{currentDate.toLocaleDateString()}</span>
            </Flex>
            <Flex vertical>
              <span className={styles.label}>Time</span>
              <span className={styles.text}>{currentDate.toLocaleTimeString()}</span>
            </Flex>
          </Flex>

          <Flex align="center" vertical>
            <div className={styles.temperature}>
              {isWeatherDataLoading ? <Spin /> : currentTemperature.toFixed(1)}
              <span>℃</span>
            </div>
            <span className={styles.label}>right now</span>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};
