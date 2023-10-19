import React from 'react';
import { Space, Layout } from 'antd';

import Connect from 'Shared/Connect';
import logoSrc from 'Assets/logo.png';

import styles from './Header.scss';

const Header = () => {
  return (
    <Layout.Header className={styles.header}>
      <Space className={styles.logo}>
        <img src={logoSrc} className={styles.logoImg} alt="Orally" />
      </Space>

      <Space>
        <Connect className={styles.connect} />
      </Space>
    </Layout.Header>
  );
};

export default Header;
