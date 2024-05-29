import { useState } from 'react';
import { Button, Space, Layout, Drawer } from 'antd';
import { WalletOutlined } from '@ant-design/icons';

import Connect from 'Shared/Connect';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';

import { Balances } from 'Components/Balances';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const { width } = useWindowDimensions();
  const [isBalancesModalVisible, setIsBalancesModalVisible] = useState(false);
  const location = useLocation();

  const isMobile = width < BREAK_POINT_MOBILE;

  return (
    <Layout.Header
      className="flex justify-between items-center fixed top-0 z-50 w-full shadow-header h-12"
      style={{
        paddingLeft: isMobile ? '65px' : '15px',
      }}
    >
      <div className="flex mr-7">
        <img src="/assets/logo.svg" alt="logo" className="h-6" />
      </div>
      <Space>
        <div className="my-1">
          {location.pathname.includes('weather') ? null : (
            <Button icon={<WalletOutlined />} onClick={() => setIsBalancesModalVisible(true)}>
              {isMobile ? null : 'Balances'}
            </Button>
          )}
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
