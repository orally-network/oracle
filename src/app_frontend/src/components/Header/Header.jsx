import React from 'react';
import { Button, Space, Layout } from 'antd';
import { WalletOutlined } from '@ant-design/icons';

import Connect from 'Shared/Connect';
import logoSrc from 'Assets/logo.png';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';

import styles from './Header.scss';

const Header = () => {
  const { width } = useWindowDimensions();

  const isMobile = width < BREAK_POINT_MOBILE;

  return (
    <Layout.Header className={styles.header} style={{ paddingLeft: isMobile ? '80px' : '30px' }}>
      <Space className={styles.logo}>
        <img src={logoSrc} className={styles.logoImg} alt="Orally" />
      </Space>
      <Space>
        <div className={styles.controls}>
          {isMobile ? (
            <Button icon={<WalletOutlined />} />
          ) : (
            <Button icon={<WalletOutlined />}>Balance</Button>
          )}
        </div>
        <Connect className={styles.connect} />
      </Space>
    </Layout.Header>
  );
};

export default Header;
