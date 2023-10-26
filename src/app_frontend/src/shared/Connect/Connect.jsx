import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { UserOutlined } from '@ant-design/icons';
// import { Button } from 'antd';

import Button from 'Components/Button';
import { truncateEthAddress } from 'Utils/addressUtils';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';

const Connect = ({ className }) => {
  const { address, isConnected } = useAccount();
  const { width } = useWindowDimensions();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const isMobile = width < BREAK_POINT_MOBILE;

  return (
    <Button
      className={className}
      icon={<UserOutlined />}
      onClick={() => (isConnected ? disconnect() : connect())}
    >
      {isMobile ? null : isConnected ? truncateEthAddress(address) : 'Connect'}
    </Button>
  );
};

export default Connect;
