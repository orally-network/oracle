import React, { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { fetchBalance } from '@wagmi/core';

import Connect from 'Shared/Connect';
import Button from 'Components/Button';
import { truncateEthAddress } from 'Utils/addressUtils';

import TopUpModal from './TopUpModal';
import styles from './Control.scss';

const Control = ({ addressData, signMessage, chain }) => {
  const [executionBalance, setExecutionBalance] = useState(null);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  
  const { address } = useAccount();
  
  const fetchExecutionBalance = useCallback(async () => {
    console.log('fetching balance', addressData.executionAddress, chain.id);
    
    const res = await fetchBalance({
      address: addressData.executionAddress,
      chainId: chain.id,
    });
    
    setExecutionBalance(res);
  }, [addressData, chain]);
  
  useEffect(() => {
    if (addressData?.executionAddress && chain && address) {
      fetchExecutionBalance();
    }
  }, [address]);
  
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
            {Number(executionBalance?.formatted).toFixed(3) ?? '-'} {chain.nativeCurrency.symbol}
          </div>
        </div>

        <Button
          className={styles.topUp}
          onClick={() => setIsTopUpModalOpen(true)}
        >
          Top up
        </Button>
      </div>
      
      <Button className={styles.subscribe}>
        Subscribe
      </Button>
      
      <TopUpModal
        isTopUpModalOpen={isTopUpModalOpen}
        setIsTopUpModalOpen={setIsTopUpModalOpen}
        chain={chain}
        executionAddress={addressData.executionAddress}
        fetchBalance={fetchExecutionBalance}
      />
    </div>
  )
};

export default Control;
