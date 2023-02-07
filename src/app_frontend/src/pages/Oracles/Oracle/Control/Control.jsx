import React from 'react';
import { useAccount } from 'wagmi';

import Connect from 'Shared/Connect';
import Button from 'Components/Button';
import { truncateEthAddress } from 'Utils/addressUtils';

import styles from './Control.scss';

const Control = ({ addressData, signMessage, chain }) => {
  const { address } = useAccount();
  
  const executionBalance = 0.1;

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
    <div className={styles.control}>
      <div className={styles.executionAddress}>
        <div className={styles.executionAddressInfo}>
          <div className={styles.address} onClick={() => navigator.clipboard.writeText(addressData.executionAddress)}>
            {truncateEthAddress(addressData.executionAddress)}
          </div>
          
          <div className={styles.balance}>
            {executionBalance} {chain.coin}
          </div>
        </div>

        <Button className={styles.topUp}>
          Top up
        </Button>
      </div>
      
      <Button className={styles.subscribe}>
        Subscribe
      </Button>
    </div>
  )
};

export default Control;
