import React, { useEffect, useState } from 'react';
import { Button, Drawer, Flex, Layout, Space, Typography } from 'antd';

import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';

import styles from './Apollo.scss';
import { Items } from './ItemsList/ItemsList';
import { ApolloDataProvider } from 'Providers/ApolloData/ApolloProvider';

export const Apollo = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  return (
    <ApolloDataProvider>
      <Layout.Content className={styles.sybil}>
        <Space size="middle" direction="vertical" style={{ width: '100%', position: 'relative' }}>
          <Flex align="center" justify="space-between" gap={8}>
            <Typography.Title style={{ minWidth: '70px' }} level={3}>
              Apollo
            </Typography.Title>
          </Flex>
        </Space>
        <Items />
      </Layout.Content>
    </ApolloDataProvider>
  );
};
