import React, { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Spin, Flex, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import Connect from 'Shared/Connect';
import Button from 'Components/Button';
import { truncateEthAddress } from 'Utils/addressUtils';
import logger from 'Utils/logger';

import TopUpModal from './TopUpModal';
// import SubscribeModal from './SubscribeModal';
import styles from './Control.scss';
import { SecondaryButton } from 'Components/SecondaryButton';
import { SignInButton } from 'Shared/SignInButton';

const MIN_BALANCE = 0.1;
const EMPTY_BALANCE = 0.001;

interface ControlProps {
  addressData: {
    address: string;
    signature: string;
  };
  chain: any;
  balance: any;
  executionAddress: any;
  refetchBalance: any;
  isBalanceLoading: boolean;
  subscribe?: () => void;
  disabled?: boolean;
  subscribed?: boolean;
  subId?: BigInt;
  stopSubscription?: any;
  startSubscription?: any;
  withdraw?: any;
  is_active?: boolean;
}

// todo: subscribed will have `stop` and `withdraw` methods
const Control = ({
  addressData,
  chain,
  subscribe,
  subscribed,
  disabled,
  subId,
  stopSubscription,
  startSubscription,
  withdraw,
  is_active,
  balance,
  executionAddress,
  refetchBalance,
  isBalanceLoading,
}: ControlProps) => {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const { address } = useAccount();

  const stopHandler = useCallback(async () => {
    setIsStopping(true);
    try {
      await toast.promise(stopSubscription(chain?.id, subId), {
        pending: `Stopping subscription...`,
        success: `Subscription stopped`,
        error: {
          render({ data }) {
            logger.error(`Stop subscription`, data);

            return 'Something went wrong. Try again later.';
          },
        },
      });
    } finally {
      setIsStopping(false);
    }
  }, [subId, stopSubscription]);

  const startHandler = useCallback(async () => {
    setIsStarting(true);
    try {
      await toast.promise(startSubscription(chain?.id, subId), {
        pending: `Starting subscription...`,
        success: `Subscription started`,
        error: {
          render({ data }) {
            logger.error(`Start subscription`, data);

            return 'Something went wrong. Try again later.';
          },
        },
      });
    } finally {
      setIsStarting(false);
    }
  }, [subId, startSubscription]);

  const withdrawHandler = useCallback(async () => {
    setIsWithdrawing(true);
    try {
      await toast.promise(withdraw(chain?.id), {
        pending: `Withdrawing...`,
        success: `Withdrawn`,
        error: {
          render({ data }) {
            logger.error(`Withdraw`, data);

            return 'Something went wrong. Try again later.';
          },
        },
      });

      refetchBalance();
    } finally {
      setIsWithdrawing(false);
    }
  }, [chain, refetchBalance, withdraw]);

  if (!address) {
    return <Connect />;
  }

  if (!addressData) {
    return <SignInButton chain={chain} />;
  }

  return (
    <div className={styles.control}>
      <Flex justify="space-between" gap="small">
        <Spin spinning={isBalanceLoading}>
          <div className={styles.executionAddressInfo}>
            Pythia Main Address
            <div
              className={styles.address}
              onClick={() => navigator.clipboard.writeText(executionAddress)}
            >
              {truncateEthAddress(executionAddress)}
            </div>
          </div>
        </Spin>

        <SecondaryButton
          icon={<DownloadOutlined />}
          className={styles.topUp}
          onClick={() => setIsTopUpModalOpen(true)}
        >
          Top up
        </SecondaryButton>
      </Flex>

      <div className={styles.balance}>
        {(Number(balance) / Math.pow(10, chain.nativeCurrency.decimals)).toFixed(3) ?? '-'}{' '}
        {chain.nativeCurrency.symbol}
      </div>

      {subscribed ? (
        <Space size="large">
          {is_active ? (
            <Spin spinning={isStopping}>
              <Button className={styles.actionBtn} type="primary" onClick={stopHandler}>
                Stop
              </Button>
            </Spin>
          ) : (
            <Spin spinning={isStarting}>
              <Button className={styles.actionBtn} type="primary" onClick={startHandler}>
                Start
              </Button>
            </Spin>
          )}

          <Spin spinning={isWithdrawing}>
            <Button
              className={styles.actionBtn}
              type="primary"
              onClick={withdrawHandler}
              disabled={balance < EMPTY_BALANCE}
            >
              Withdraw
            </Button>
          </Spin>
        </Space>
      ) : (
        subscribe && (
          <Button
            className={styles.subscribe}
            disabled={balance < MIN_BALANCE || subscribed || disabled}
            onClick={subscribe}
            type="primary"
          >
            Subscribe{subscribed && 'd'}
          </Button>
        )
      )}

      {isTopUpModalOpen && (
        <TopUpModal
          isTopUpModalOpen={isTopUpModalOpen}
          setIsTopUpModalOpen={setIsTopUpModalOpen}
          chain={chain}
          executionAddress={executionAddress}
          refetchBalance={refetchBalance}
          decimals={chain.nativeCurrency.decimals}
          symbol={chain.nativeCurrency.symbol}
        />
      )}

      {/*<SubscribeModal*/}
      {/*  isSubscribeModalOpen={isSubscribeModalOpen}*/}
      {/*  setIsSubscribeModalOpen={setIsSubscribeModalOpen}*/}
      {/*  addressData={addressData}*/}
      {/*  subscribe={subscribe}*/}
      {/*/>*/}
    </div>
  );
};

export default Control;
