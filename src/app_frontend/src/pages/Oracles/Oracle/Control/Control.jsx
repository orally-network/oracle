import React, { useEffect, useState } from 'react';
import { useAccount, useProvider } from 'wagmi';
import { utils } from 'ethers';

import Connect from 'Shared/Connect';
import Button from 'Components/Button';
import { truncateEthAddress } from 'Utils/addressUtils';

import styles from './Control.scss';

const Control = ({ addressData, signMessage, chain }) => {
  const { address } = useAccount();
  const provider = useProvider({
    chainId: chain.id,
  });
  const [executionBalance, setExecutionBalance] = useState(0);

  useEffect(() => {
    console.log({addressData, provider, chain});
    
    if (addressData?.executionAddress && provider && chain) {
      const fetch = async () => {
        console.log('fetching balance', addressData.executionAddress, chain.id);
        const res = await provider.getBalance(addressData.executionAddress);

        setExecutionBalance(
          Number(utils.formatUnits(res, chain.nativeCurrency.decimals)).toFixed(3)
        );
      };

      fetch();
    }
  }, []);
  
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
  
  return (
    <div className={styles.control}>
      <div className={styles.executionAddress}>
        <div className={styles.executionAddressInfo}>
          <div className={styles.address} onClick={() => navigator.clipboard.writeText(addressData.executionAddress)}>
            {truncateEthAddress(addressData.executionAddress)}
          </div>
          
          <div className={styles.balance}>
            {executionBalance} {chain.nativeCurrency.symbol}
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
