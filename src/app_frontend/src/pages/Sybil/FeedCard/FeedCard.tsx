import React, { useState } from 'react';
import { Space, Card, Typography, Flex, Drawer, Skeleton as AntdSkeleton } from 'antd';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';

import styles from './FeedCard.scss';
import { BREAK_POINT_MOBILE } from 'Constants/ui';

import useWindowDimensions from 'Utils/useWindowDimensions';
import { Feed } from 'Interfaces/feed';
import { FeedLogos } from './FeedLogos';

interface FeedCardProps {
  feed: Feed;
}

const FeedCard = ({ feed }: FeedCardProps) => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [isFeedDetailsVisible, setIsFeedDetailsVisible] = useState<boolean>(false);

  const { id, decimals, owner, data, update_freq, feed_type } = feed;

  const { symbol, rate, timestamp } = data[0];

  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const lastUpdateDateTime = new Date(Number(timestamp) * 1000);
  const diffMs = Math.abs(+new Date() - +lastUpdateDateTime);
  const lastRate = Number(rate) / Math.pow(10, Number(decimals));

  return (
    <Card hoverable={true} className={styles.feed}>
      <Space size="small" direction="vertical" style={{ width: '100%' }}>
        <div className={styles.header}>
          <div className={styles.info}>
            {/* <div>Example</div> name field will be added later  */}
            <Space>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {symbol}
              </Typography.Title>
            </Space>
          </div>

          {/* <div className={styles.menu} onClick={() => setIsFeedDetailsVisible(true)}>
            {feed.owner === address?.toLowerCase?.() ? <EditOutlined /> : <EyeOutlined />}
          </div> */}
        </div>

        <div className={styles.logoBg}>
          <Flex className={styles.logo} align="center" justify="center">
            <FeedLogos feed={id} />
          </Flex>
        </div>

        <Flex justify="space-between" gap={10}>
          <div className={styles.stat}>
            Last Data
            <br />
            <Typography.Title level={5}>${lastRate.toFixed(3)}</Typography.Title>
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
          onClose={() => setIsFeedDetailsVisible(false)}
          open={isFeedDetailsVisible}
          style={{ marginTop: '47px' }}
          width={isMobile ? '90vw' : '362px'}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            Details
          </Space>
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
