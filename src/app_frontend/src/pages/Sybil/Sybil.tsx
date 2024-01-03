import React, { useEffect } from 'react';
import { Button, Flex, Layout, Space, Typography } from 'antd';

import { Feeds } from './FeedsList/Feeds';
import CustomFeed from './CustomFeed';

import styles from './Sybil.scss';
import { PlusCircleOutlined } from '@ant-design/icons';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import SybilFeedsProvider from 'Providers/SybilPairs/SybilFeedsProvider';
import { Filters } from './Filters/Filters';
import { useSearchParams } from 'react-router-dom';
import useSybilData from 'Providers/SybilPairs/useSybilFeeds';
import { FilterFeedType } from 'Interfaces/feed';

const Sybil = () => {
  const [searchParams] = useSearchParams();
  const { setFeedType, setShowMine } = useSybilData();

  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  useEffect(() => {
    const typeFilter = searchParams.get('type');
    const authorFilter = searchParams.get('showMine');
    if (typeFilter !== null) {
      setFeedType(typeFilter as FilterFeedType);
    }
    setShowMine(authorFilter === 'true' ? true : false);
  }, [searchParams, setFeedType, setShowMine]);

  return (
    <SybilFeedsProvider>
      <Layout.Content className={styles.sybil}>
        <Space size="middle" direction="vertical" style={{ width: '100%', position: 'relative' }}>
          <Flex align="center" justify="space-between" gap={8}>
            <Typography.Title style={{ minWidth: '70px' }} level={3}>
              Sybil
            </Typography.Title>
            <Filters />
            <Button
              type="primary"
              size="large"
              onClick={() => console.log('create feed modal')}
              icon={<PlusCircleOutlined />}
              style={{ width: isMobile ? '40px' : 'auto', height: isMobile ? '40px' : 'auto' }}
            >
              {isMobile ? '' : 'Create feed'}
            </Button>
          </Flex>
          <Feeds />

          {/* <CustomFeed /> */}
        </Space>
      </Layout.Content>
    </SybilFeedsProvider>
  );
};

export default Sybil;
