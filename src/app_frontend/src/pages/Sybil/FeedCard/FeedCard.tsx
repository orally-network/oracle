import React, { useState, useCallback } from 'react';
import { Space, Card, Typography, Flex, Drawer, Skeleton as AntdSkeleton } from 'antd';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';

import styles from './FeedCard.scss';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import { NewFeed } from 'Pages/Sybil/NewFeed/NewFeed';
import weatherImg from 'Assets/weather.png';

import useWindowDimensions from 'Utils/useWindowDimensions';
import { Feed } from 'Interfaces/feed';
import { FeedLogos } from './FeedLogos';
import { BlockOutlined } from '@ant-design/icons';

interface FeedCardProps {
  feed: Feed;
}

const getFeedImg = ({ feed_type, id, isWeather }) => {
  if (feed_type && id && feed_type.Default === null) {
    return <FeedLogos feed={id} />
  }

  if (isWeather) {
    return <img src={weatherImg} alt="sun" />;
  }

  return <BlockOutlined
    style={{
      fontSize: '35px',
    }}
  />;
}

const FeedCard = ({ feed }: FeedCardProps) => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [isFeedDetailsVisible, setIsFeedDetailsVisible] = useState<boolean>(false);

  const { id, decimals, owner, data, update_freq, feed_type } = feed;

  let symbol, rate, timestamp;

  if (data && data.length !== 0) {
    const feed = data[0].data.DefaultPriceFeed ?? data[0].data.CustomPriceFeed;

    symbol = feed.symbol;
    rate = feed.rate;
    timestamp = feed.timestamp;
  }

  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const lastUpdateDateTime = new Date(Number(timestamp) * 1000);
  const diffMs = Math.abs(+new Date() - +lastUpdateDateTime);
  const lastRate = Number(rate) / Math.pow(10, Number(decimals?.[0]));
  const isWeather = id.toLowerCase().includes('weather');

  const openDetails = useCallback(() => {
    if (feed_type.Custom === null) {
      setIsFeedDetailsVisible(true);
    }
  }, [feed_type]);

  const closeDetails = useCallback(() => {
    setIsFeedDetailsVisible(false);
  }, []);

  return (
    <Card hoverable={true} className={styles.feed}>
      <Space size="small" direction="vertical" style={{ width: '100%' }} onClick={openDetails}>
        <div className={styles.header}>
          <div className={styles.info}>
            {/* <div>{id}</div> */}
            <Space>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {id}
              </Typography.Title>
            </Space>
          </div>

          {/* <div className={styles.menu} onClick={() => setIsFeedDetailsVisible(true)}>
            {feed.owner === address?.toLowerCase?.() ? <EditOutlined /> : <EyeOutlined />}
          </div> */}
        </div>

        <div className={styles.logoBg}>
          <Flex className={styles.logoWrap} align="center" justify="center">
            {getFeedImg({ feed_type, id, isWeather })}
          </Flex>
        </div>

        <Flex justify="space-between" gap={10}>
          <div className={styles.stat}>
            Last Data
            <br />
            <Typography.Title level={5}>{(decimals?.[0] && !isWeather) ? '$' : ''}{lastRate.toFixed(3)}</Typography.Title>
          </div>
          <div className={styles.stat}>
            Last update <br />
            <Typography.Title level={5}>{new Date(diffMs).getMinutes()} mins ago</Typography.Title>
          </div>
        </Flex>
      </Space>

      {isFeedDetailsVisible && (
        <Drawer
          title="Feed details"
          placement="right"
          onClose={closeDetails}
          open={isFeedDetailsVisible}
          style={{ marginTop: '47px' }}
          width={isMobile ? '90vw' : '362px'}
        >
          <NewFeed
            feedId={id}
            frequency={update_freq}
            decimals={decimals?.[0]}
            sources={feed.sources?.[0]}
          />
        </Drawer>
      )}
    </Card>
  );
};

const Skeleton = () => {
  return (
    <Card hoverable={true} className={styles.feed}>
      <AntdSkeleton active paragraph={{ rows: 3 }} round loading />
    </Card>
  );
};

export default Object.assign(FeedCard, { Skeleton });
