import React from 'react';
import { Button, Space, Layout } from 'antd';
import { WalletOutlined } from '@ant-design/icons';

import Connect from 'Shared/Connect';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import LogoText from 'Assets/logo.svg';

import styles from './Header.scss';

const Header = () => {
  const { width } = useWindowDimensions();

  const isMobile = width < BREAK_POINT_MOBILE;

  return (
    <Layout.Header
      className={styles.header}
      style={{
        paddingLeft: isMobile ?  '65px' : '15px', 
      }}
    >
        <div className={styles.logo}>
          <LogoText height={20} />
        </div>
      <Space>
        <div className={styles.controls}>
          {isMobile ? (
            <Button icon={<WalletOutlined />} />
          ) : (
            <Button icon={<WalletOutlined />}>Balance</Button>
          )}
        </div>
        <Connect />
      </Space>
    </Layout.Header>
  );
};

export default Header;
