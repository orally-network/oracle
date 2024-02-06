import React, { useState } from 'react';
import { Button, Space, Layout, Drawer } from 'antd';
import { WalletOutlined } from '@ant-design/icons';

import Connect from 'Shared/Connect';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import LogoText from 'Assets/logo.svg';

import styles from './Header.scss';
import { Balances } from 'Components/Balances';

const Header = () => {
  const { width } = useWindowDimensions();
  const [isBalancesModalVisible, setIsBalancesModalVisible] = useState(false);

  const isMobile = width < BREAK_POINT_MOBILE;

  return (
    <Layout.Header
      className={styles.header}
      style={{
        paddingLeft: isMobile ? '65px' : '15px',
      }}
    >
      <div className={styles.logo}>
        <LogoText height={20} />
      </div>
      <Space>
        <div className={styles.controls}>
          <Button icon={<WalletOutlined />} onClick={() => setIsBalancesModalVisible(true)}>
            {isMobile ? null : 'Balances'}
          </Button>
        </div>
        <Connect />
      </Space>

      {isBalancesModalVisible && (
        <Drawer
          title="Balances"
          placement="right"
          onClose={() => setIsBalancesModalVisible(false)}
          open={isBalancesModalVisible}
          style={{ marginTop: '47px' }}
          width={isMobile ? '90vw' : '362px'}
        >
          <Balances />
        </Drawer>
      )}
    </Layout.Header>
  );
};

export default Header;
