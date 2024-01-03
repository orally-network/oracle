import React from 'react';
import { Button, Flex, Layout, Space, Typography } from 'antd';

import { Feeds } from './FeedsList/Feeds';
import CustomFeed from './CustomFeed';

import styles from './Sybil.scss';
import { PlusCircleOutlined } from '@ant-design/icons';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import SybilFeedsProvider from 'Providers/SybilPairs/SybilFeedsProvider';

const Sybil = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  return (
    <SybilFeedsProvider>
      <Layout.Content className={styles.sybil}>
        <Space size="middle" direction="vertical" style={{ width: '100%', position: 'relative' }}>
          <Flex align="center" justify="space-between" gap={8}>
            <Typography.Title style={{ minWidth: '70px' }} level={3}>
              Sybil
            </Typography.Title>

            {/* <FiltersBar /> make filters reusable */}

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
