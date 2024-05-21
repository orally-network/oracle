import { Card, Flex, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './WeatherAuction.module.scss';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import { getWeatherIcon } from 'Utils/mapWeatherData';
import config from 'Constants/config';
import { Helmet } from 'react-helmet';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';

const getWeatherSources = (cityName, cityLat, cityLon) => {
  const weatherSource1 = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=metric&include=current&key=${config.weatherSource1Key}&contentType=json`;
  const weatherSource2 = `https://api.weatherapi.com/v1/current.json?key=${config.weatherSource2Key}&q=${cityName}&aqi=no`;
  const weatherSource3 = `https://api.openweathermap.org/data/3.0/onecall?lat=${cityLat}&lon=${cityLon}&exclude=daily,hourly,minutely&appid=${config.weatherSource3Key}&units=metric`;

  return { weatherSource1, weatherSource2, weatherSource3 };
};

async function fetchWeatherResource(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // throw new Error('Network response was not ok');

      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isWeatherDataLoading, setIsWeatherDataLoading] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;
  const { prediction } = useWeatherData();

  const { weatherSource1, weatherSource2, weatherSource3 } = getWeatherSources(prediction.name, prediction.lat, prediction.lon);

  const fetchWeatherData = async () => {
    setIsWeatherDataLoading(true);
    try {
      const [result1, result2, result3] = await Promise.all([
        fetchWeatherResource(weatherSource1),
        fetchWeatherResource(weatherSource2),
        fetchWeatherResource(weatherSource3),
      ]);

      const tempFromResult1 = result1?.currentConditions?.temp;
      const tempFromResult2 = result2?.current?.temp_c;
      const tempFromResult3 = result3?.current?.temp;
      const tempArray = [
        tempFromResult1 ?? null,
        tempFromResult2 ?? null,
        tempFromResult3 ?? null,
      ].filter(Boolean);

      const average = tempArray.reduce((a, b) => a + b, 0) / tempArray.length;

      setWeatherData({
        ...result1,
        currentTemperature: Math.floor(average * 10) / 10,
      });
      return result1;
    } catch (err) {
      console.error(err);
      try {
        const backupRes = await fetch(weatherSource2);
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
    isWeatherDataLoading || !weatherData ? 0 : weatherData.currentTemperature;

  const weatherIcon = !weatherData
    ? 'clear-day'
    : weatherData?.currentConditions?.icon || getWeatherIcon(weatherData?.current);

  console.log({ weatherData });

  return (
    <>
      <Helmet>
        <meta name="description" content="Try to guess temperature and win the whole prize pool." />
        <meta property="og:image" content="weather-prediction.png" />
        <title>{`Predict the Weather | ${currentTemperature}`}</title>
      </Helmet>
      <Flex gap="middle" vertical={isMobile}>
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
          <Flex gap={isMobile ? 30 : 80}>
            <Flex vertical gap="large">
              <Typography.Title level={5}>Weather in {prediction.title}</Typography.Title>
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
                {isWeatherDataLoading ? <Spin /> : currentTemperature}
                <span>℃</span>
              </div>
              <span className={styles.label}>right now</span>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </>
  );
};
