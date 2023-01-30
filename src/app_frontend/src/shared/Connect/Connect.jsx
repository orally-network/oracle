import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import Button from 'Components/Button';

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
      {isConnected ? address : 'Connect'}
    </Button>
  );
};

export default Connect;
