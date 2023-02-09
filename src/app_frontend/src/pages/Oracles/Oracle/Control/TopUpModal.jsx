import React, { useState, useCallback } from 'react';
import { sendTransaction, prepareSendTransaction, getNetwork, switchNetwork, waitForTransaction } from '@wagmi/core';
import { utils } from 'ethers';

import Modal from 'Components/Modal';
import Input from 'Components/Input';
import Button from 'Components/Button';

import styles from './Control.scss';

const DEFAULT_AMOUNT = 0.1;

const TopUpModal = ({ isTopUpModalOpen, setIsTopUpModalOpen, chain, executionAddress, fetchBalance }) => {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  
  const topUp = useCallback(async () => {
    const { chain: currentChain } = getNetwork();

    if (currentChain.id !== chain.id) {
      await switchNetwork({
        chainId: chain.id,
      });
    }
    
    const config = await prepareSendTransaction({
      request: {
        to: executionAddress,
        value: utils.parseUnits(String(amount), chain.nativeCurrency.decimals)
      },
    });
    const { hash } = await sendTransaction(config);
    
    const data = await waitForTransaction({ hash });
    
    console.log({ data, hash });
    
    await fetchBalance();
  }, [amount, chain, executionAddress]);
  
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
          onClick={topUp}
        >
          Top Up
        </Button>
      </div>
    </Modal>
  )
};

export default TopUpModal;
