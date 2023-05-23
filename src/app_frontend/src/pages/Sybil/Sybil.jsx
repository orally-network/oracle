import React from 'react';
import { Layout } from 'antd';

import Feeds from './Feeds';

import styles from './Sybil.scss';

const Sybil = () => {
  return (
    <Layout.Content className={styles.sybil}>
      <Feeds />
    </Layout.Content>
  )
};

export default Sybil;