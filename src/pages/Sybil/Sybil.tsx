import React, { useEffect, useState } from 'react';
import { Button, Drawer, Flex, Layout, Space, Typography } from 'antd';

import { Feeds } from './FeedsList/Feeds';

import { PlusCircleOutlined } from '@ant-design/icons';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import { Filters } from './Filters/Filters';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useSybilData from 'Providers/SybilPairs/useSybilFeeds';
import { FilterFeedType } from 'Interfaces/feed';
import { NewFeed } from './NewFeed/NewFeed';
import { Helmet } from 'react-helmet';

const Sybil = () => {
  const [isNewFeedModalVisible, setIsNewFeedModalVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
    <>
      <Helmet>
        <meta
          name="description"
          content="Sybil - Setup custom data feed to empower you smart contract with real world data "
        />
        <meta property="og:image" content="sybil.png" />
        <title>Orally Network | Sybil - Permissionless Data Fetcher</title>
      </Helmet>

      <Layout.Content>
        <Space size="middle" direction="vertical" style={{ width: '100%', position: 'relative' }}>
          <Flex align="center" justify="space-between" gap={8}>
            <Typography.Title style={{ minWidth: '70px' }} level={3}>
              Sybil
            </Typography.Title>
            <Filters />
            <Button
              type="primary"
              size="large"
              onClick={() => setIsNewFeedModalVisible(!isNewFeedModalVisible)}
              icon={<PlusCircleOutlined />}
              style={{ width: isMobile ? '40px' : 'auto', height: isMobile ? '40px' : 'auto' }}
            >
              {isMobile ? '' : 'Create feed'}
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('api-keys')}
              style={{ width: isMobile ? '40px' : 'auto', height: isMobile ? '40px' : 'auto' }}
            >
              {'API Keys'}
            </Button>
          </Flex>
          <Feeds />

          {isNewFeedModalVisible && (
            <Drawer
              title="Create Feed"
              placement="right"
              onClose={() => setIsNewFeedModalVisible(false)}
              open={isNewFeedModalVisible}
              style={{ marginTop: '47px' }}
              width={isMobile ? '90vw' : '362px'}
            >
              <NewFeed />
            </Drawer>
          )}
        </Space>
      </Layout.Content>
    </>
  );
};

export default Sybil;
