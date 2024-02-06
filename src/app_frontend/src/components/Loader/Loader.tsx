import { Spin } from 'antd';
import { SpinSize } from 'antd/es/spin';
import React from 'react';

import styles from './Loader.scss';

const Loader = ({ size = 'default', isFullPage }: { size?: SpinSize; isFullPage?: boolean }) => {
  return (
    <div
      className={styles.container}
      style={{ height: isFullPage ? 'calc(100vh - 200px)' : 'auto' }}
    >
      <Spin size={size} />
    </div>
  );
};

export default Loader;
