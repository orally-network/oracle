import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import Button from 'Components/Button';
import { truncateEthAddress } from 'Utils/addressUtils';

const Connect = ({ className }) => {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  return (
    <Button
      className={className}
      onClick={() => isConnected ? disconnect() : connect()}
    >
      {isConnected ? truncateEthAddress(address) : 'Connect'}
    </Button>
  );
};

export default Connect;
