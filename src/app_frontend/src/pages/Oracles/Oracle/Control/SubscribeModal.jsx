import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FileUploader } from "react-drag-drop-files";

import Modal from 'Components/Modal';
import Input from 'Components/Input';
import Button from 'Components/Button';
import logger from 'Utils/logger';

import styles from './Control.scss';

const fileTypes = ["JSON"];

const SubscribeModal = ({ isSubscribeModalOpen, setIsSubscribeModalOpen, addressData, oracle }) => {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [methodName, setMethodName] = useState('');
  
  console.log({ oracle });

  const subscribe = useCallback(async () => {
    setIsSubscribeModalOpen(false);
    
    const res = await toast.promise(
      oracle.subscribe(destinationAddress, methodName, addressData.message, addressData.signature),
      {
        pending: `Subscribe ${destinationAddress}:${methodName} to oracle`,
        success: `Subscribed successfully`,
        error: {
          render({ error }) {
            logger.error(`Subscribe ${destinationAddress}:${methodName} to oracle`, error);

            return 'Something went wrong. Try again later.';
          }
        },
      }
    );
    
    console.log({ res });
  }, [methodName, destinationAddress, addressData]);

  return (
    <Modal
      isOpen={isSubscribeModalOpen}
      onClose={useCallback(() => setIsSubscribeModalOpen(false), [])}
    >
      <div className={styles.subscribeModal}>
        <Input
          value={destinationAddress}
          placeholder="0x..."
          onChange={useCallback((e) => setDestinationAddress(e.target.value), [])}
        />

        <Input
          className={styles.methodInput}
          value={methodName}
          placeholder="method_name"
          onChange={useCallback((e) => setMethodName(e.target.value), [])}
        />

        <Button
          className={styles.subscribeBtn}
          onClick={subscribe}
        >
          Subscribe
        </Button>
      </div>
    </Modal>
  )
};

export default SubscribeModal;
