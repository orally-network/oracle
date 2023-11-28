import React from 'react';
import { Layout, Space, Typography } from 'antd';

import Pairs from './Pairs';
import CustomPair from './CustomPair';
import Verifiers from './Verifiers';

import styles from './Sybil.scss';

const Sybil = () => {
  return (
    <Layout.Content className={styles.sybil}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Typography.Title level={3}>Sybil</Typography.Title>
        <Pairs />

        <Verifiers />

        <CustomPair />
      </Space>
    </Layout.Content>
  );
};

export default Sybil;
