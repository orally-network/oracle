import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

import Connect from 'Shared/Connect';
import Button from 'Components/Button';
import { truncateEthAddress } from 'Utils/addressUtils';

import TopUpModal from './TopUpModal';
import SubscribeModal from './SubscribeModal';
import styles from './Control.scss';

const MIN_BALANCE = 0.1;

// todo: subscribed will have `stop` and `withdraw` methods
const Control = ({ addressData, signMessage, chain, subscribe = () => {}, subscribed }) => {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  
  const { address } = useAccount();
  const { data: executionBalance, refetch: refetchBalance } = useBalance({
    address: addressData?.executionAddress,
    chainId: chain?.id,
  });
  
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
      
      <Button
        className={styles.subscribe}
        disabled={executionBalance?.formatted < MIN_BALANCE || subscribed}
        onClick={() => setIsSubscribeModalOpen(true)}
      >
        Subscribe{subscribed && 'd'}
      </Button>

      {isTopUpModalOpen && (
        <TopUpModal
          isTopUpModalOpen={isTopUpModalOpen}
          setIsTopUpModalOpen={setIsTopUpModalOpen}
          chain={chain}
          executionAddress={addressData.executionAddress}
          refetchBalance={refetchBalance}
        />
      )}
      
      <SubscribeModal
        isSubscribeModalOpen={isSubscribeModalOpen}
        setIsSubscribeModalOpen={setIsSubscribeModalOpen}
        addressData={addressData}
        subscribe={subscribe}
      />
    </div>
  )
};

export default Control;
