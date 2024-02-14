import React, { useEffect, useState } from 'react';
import { Button, Drawer, Flex, Layout, Space, Typography } from 'antd';

import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';

import styles from './Apollo.scss';
import { useGetApolloItems } from 'ApiHooks/useGetApolloItems';

export const Apollo = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const data = useGetApolloItems();

  return (
    <Layout.Content className={styles.sybil}>
      <Space size="middle" direction="vertical" style={{ width: '100%', position: 'relative' }}>
        <Flex align="center" justify="space-between" gap={8}>
          <Typography.Title style={{ minWidth: '70px' }} level={3}>
            Apollo
          </Typography.Title>
        </Flex>
        <pre>{JSON.stringify(data, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2)}</pre>
      </Space>
    </Layout.Content>
  );
};
