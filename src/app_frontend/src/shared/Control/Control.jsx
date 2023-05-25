import React, { useState, useCallback } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Spin } from 'antd';
import { toast } from 'react-toastify';

import Connect from 'Shared/Connect';
import Button from 'Components/Button';
import { truncateEthAddress } from 'Utils/addressUtils';
import logger from 'Utils/logger';

import TopUpModal from './TopUpModal';
import SubscribeModal from './SubscribeModal';
import styles from './Control.scss';

const MIN_BALANCE = 0.1;
const EMPTY_BALANCE = 0.001;

// todo: subscribed will have `stop` and `withdraw` methods
const Control = ({ addressData, signMessage, chain, subscribe = () => {}, subscribed, disabled, subId, stopSubscription, startSubscription, withdraw, is_active }) => {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  const { address } = useAccount();
  const { data: executionBalance, refetch: refetchBalance } = useBalance({
    address: addressData?.executionAddress,
    chainId: chain?.id,
  });
  
  const signMessageHandler = useCallback(async () => {
    setIsSigning(true);
    try {
      await toast.promise(
        signMessage(chain?.id),
        {
          pending: `SIWE processing...`,
          success: `SIWE processed`,
          error: {
            render({ error }) {
              logger.error(`SIWE`, error);

              return 'Something went wrong. Try again later.';
            }
          },
        }
      );
    } finally {
      setIsSigning(false);
    }
  }, [chain]);
  
  const stopHandler = useCallback(async () => {
    setIsStopping(true);
    try {
      await toast.promise(
        stopSubscription(subId),
        {
          pending: `Stopping subscription...`,
          success: `Subscription stopped`,
          error: {
            render({ error }) {
              logger.error(`Stop subscription`, error);

              return 'Something went wrong. Try again later.';
            }
          },
        }
      );
    } finally {
      setIsStopping(false);
    }
  }, [subId]);
  
  const startHandler = useCallback(async () => {
    setIsStarting(true);
    try {
      await toast.promise(
        startSubscription(subId),
        {
          pending: `Starting subscription...`,
          success: `Subscription started`,
          error: {
            render({ error }) {
              logger.error(`Start subscription`, error);

              return 'Something went wrong. Try again later.';
            }
          },
        }
      );
    } finally {
      setIsStarting(false);
    }
  }, [subId]);
  
  const withdrawHandler = useCallback(async () => {
    setIsWithdrawing(true);
    try {
      await toast.promise(
        withdraw(chain?.id),
        {
          pending: `Withdrawing...`,
          success: `Withdrawn`,
          error: {
            render({ error }) {
              logger.error(`Withdraw`, error);

              return 'Something went wrong. Try again later.';
            }
          },
        }
      );
      
      refetchBalance();
    } finally {
      setIsWithdrawing(false);
    }
  }, [chain, refetchBalance]);
  
  if (!address) {
    return <Connect />;
  }
  
  if (!addressData) {
    return (
      <Spin spinning={isSigning}>
        <Button
          onClick={signMessageHandler}
          type="primary"
          className={styles.signMessage}
        >
          Sign message
        </Button>
      </Spin>
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
            {Number(executionBalance?.formatted).toFixed(3) ?? '-'} {chain?.nativeCurrency?.symbol}
          </div>
        </div>

        <Button
          className={styles.topUp}
          onClick={() => setIsTopUpModalOpen(true)}
          type="primary"
        >
          Top up
        </Button>
      </div>

      {subscribed ? (
        <div className={styles.actionBtns}>
          {is_active ? (
            <Spin spinning={isStopping}>
              <Button
                className={styles.actionBtn}
                type="primary"
                onClick={stopHandler}
              >
                Stop
              </Button>
            </Spin>
          ) : (
            <Spin spinning={isStarting}>
              <Button
                className={styles.actionBtn}
                type="primary"
                onClick={startHandler}
              >
                Start
              </Button>
            </Spin>
          )}
          
          <Spin spinning={isWithdrawing}>
            <Button
              className={styles.actionBtn}
              type="primary"
              onClick={withdrawHandler}
              disabled={executionBalance?.formatted < EMPTY_BALANCE}
            >
              Withdraw
            </Button>
          </Spin>
        </div>
      ) : (
        <Button
          className={styles.subscribe}
          disabled={executionBalance?.formatted < MIN_BALANCE || subscribed || disabled}
          onClick={subscribe}
          type="primary"
        >
          Subscribe{subscribed && 'd'}
        </Button>
      )}

      {isTopUpModalOpen && (
        <TopUpModal
          isTopUpModalOpen={isTopUpModalOpen}
          setIsTopUpModalOpen={setIsTopUpModalOpen}
          chain={chain}
          executionAddress={addressData.executionAddress}
          refetchBalance={refetchBalance}
        />
      )}
      
      {/*<SubscribeModal*/}
      {/*  isSubscribeModalOpen={isSubscribeModalOpen}*/}
      {/*  setIsSubscribeModalOpen={setIsSubscribeModalOpen}*/}
      {/*  addressData={addressData}*/}
      {/*  subscribe={subscribe}*/}
      {/*/>*/}
    </div>
  )
};

export default Control;
