import React from 'react';
import { useAccount } from 'wagmi';

import Connect from 'Shared/Connect';
import Button from 'Components/Button';

const Control = ({ addressData, signMessage }) => {
  const { address } = useAccount();

  if (!address) {
    return <Connect />;
  }
  
  if (!addressData) {
    return (
      <Button
        onClick={signMessage}
      >
        Sign message
      </Button>
    );
  }
  
  console.log({ addressData })
  
  return (
    <div>
      {!address}
    </div>
  )
};

export default Control;
