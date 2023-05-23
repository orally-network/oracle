import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSendTransaction, usePrepareSendTransaction, useSwitchNetwork, useNetwork } from 'wagmi';
import { utils } from 'ethers';
import { Input } from 'antd';

import Modal from 'Components/Modal';
import Button from 'Components/Button';
import logger from 'Utils/logger';

import styles from './Control.scss';

const DEFAULT_AMOUNT = 0.1;

const TopUpModal = ({ isTopUpModalOpen, setIsTopUpModalOpen, chain, executionAddress, refetchBalance }) => {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);

  const { chain: currentChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const { config } = usePrepareSendTransaction({
    request: {
      to: executionAddress,
      value: utils.parseUnits(String(amount), chain.nativeCurrency.decimals),
    },
    chainId: chain.id,
  });
  const { sendTransactionAsync } = useSendTransaction(config);
  
  useEffect(() => {
    if (currentChain.id !== chain.id) {
      switchNetwork(chain.id);
    }
  }, []);
  
  const topUp = useCallback(async () => {
    const { hash, wait } = await sendTransactionAsync();

    setIsTopUpModalOpen(false);
    
    console.log({ hash, wait })
    
    const data = await toast.promise(
      wait,
      {
        pending: `Sending ${amount} ${chain.nativeCurrency.symbol} to ${executionAddress}`,
        success: `Sent successfully`,
        error: {
          render({ error }) {
            logger.error(`Sending ${chain.nativeCurrency.symbol}`, error);

            return 'Something went wrong. Try again later.';
          }
        },
      }
    );
    
    console.log({ data, hash });
    
    await refetchBalance();
  }, [amount, chain, executionAddress, sendTransactionAsync, refetchBalance]);
  
  return (
    <Modal
      isOpen={isTopUpModalOpen}
      onClose={useCallback(() => setIsTopUpModalOpen(false), [])}
    >
      <div className={styles.topUpModal}>
        <Input
          value={amount}
          type="number"
          onChange={useCallback((e) => setAmount(e.target.value), [])}
        />
        
        <Button
          className={styles.topUpBtn}
          disabled={currentChain.id !== chain.id}
          onClick={topUp}
        >
          Top Up
        </Button>
      </div>
    </Modal>
  )
};

export default TopUpModal;
