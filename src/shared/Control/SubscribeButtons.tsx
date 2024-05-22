import React, { useState } from 'react';
import { Spin, Space } from 'antd';
import Button from 'Components/Button';
import styles from './Control.module.scss';
import { toast } from 'react-toastify';
import logger from 'Utils/logger';
import { EMPTY_BALANCE, MIN_BALANCE } from 'Constants/ui';

interface SubscribeButtonsProps {
  balance: any;
  subscribed?: boolean;
  isActive?: boolean;
  subscribe?: () => void;
  stopSubscription: (chainId: any, subId: any) => Promise<void>;
  startSubscription: (chainId: any, subId: any) => Promise<void>;
  refetchBalance: () => void;
  withdraw?: any;
  disabled?: boolean;
  chain: any;
  subId?: BigInt;
}

export const SubscribeButtons = ({
  subscribed,
  isActive,
  subscribe,
  stopSubscription,
  startSubscription,
  refetchBalance,
  withdraw,
  chain,
  subId,
  balance,
  disabled,
}: SubscribeButtonsProps) => {
  const [isStopping, setIsStopping] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const stopHandler = async () => {
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
  };

  const startHandler = async () => {
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
  };

  const withdrawHandler = async () => {
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
  };

  if (subscribed) {
    return (
      <Space size="large">
        {isActive ? (
          <Spin spinning={isStopping}>
            <Button className={styles.actionBtn} type="primary" onClick={stopHandler}>
              Stop
            </Button>
          </Spin>
        ) : (
          <Spin spinning={isStarting}>
            <Button
              className={styles.actionBtn}
              type="primary"
              onClick={startHandler}
              disabled={balance < MIN_BALANCE}
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
            disabled={balance < EMPTY_BALANCE}
          >
            Withdraw
          </Button>
        </Spin>
      </Space>
    );
  } else if (!subscribed && subscribe) {
    return (
      <Button
        className={styles.subscribe}
        disabled={balance < MIN_BALANCE || subscribed || disabled}
        onClick={subscribe}
        type="primary"
      >
        Subscribe{subscribed && 'd'}
      </Button>
    );
  }
  return null;
};
