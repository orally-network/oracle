import React from 'react';
import { Layout } from 'antd';

import Feeds from './Feeds';
import CustomPair from './CustomPair';
import Verifiers from './Verifiers';

import styles from './Sybil.scss';

const Sybil = () => {
  return (
    <Layout.Content className={styles.sybil}>
      <Feeds />

      <Verifiers />

      <CustomPair />
    </Layout.Content>
  )
};

export default Sybil;