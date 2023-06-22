import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSendTransaction, usePrepareSendTransaction, useSwitchNetwork, useNetwork, usePrepareContractWrite } from 'wagmi';
import { utils } from 'ethers';
import { Input, Modal } from 'antd';
import { waitForTransaction } from '@wagmi/core'

// import Modal from 'Components/Modal';
import Button from 'Components/Button';
import logger from 'Utils/logger';
import { usePythiaData } from 'Providers/PythiaData';

import styles from './Control.scss';

const DEFAULT_AMOUNT = 0.1;

const TopUpModal = ({ isTopUpModalOpen, setIsTopUpModalOpen, chain, executionAddress, refetchBalance, token, decimals, symbol }) => {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);

  const { chain: currentChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { deposit } = usePythiaData();
  
  console.log({
    chain,
    executionAddress,
    decimals,
    amount,
  })
  
  const config = usePrepareSendTransaction({
    to: executionAddress,
    value: utils.parseUnits(String(amount || 0), decimals),
    chainId: chain.id,
  });
  const { config: tokenSendConfig } = usePrepareContractWrite({
    address: token,
    abi: [
      {
        name: 'transfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        outputs: [
          {
            "name": "",
            "type": "bool"
          }
        ],
      },
    ],
    functionName: 'transfer',
    args: [executionAddress, utils.parseUnits(String(amount || 0), decimals)],
    enabled: Boolean(token),
  })
  console.log({ config });
  const { sendTransactionAsync } = useSendTransaction({
    ...config.data ?? {},
    value: config.data?.value?.hex,
  });
  
  useEffect(() => {
    if (currentChain.id !== chain.id) {
      switchNetwork(chain.id);
    }
  }, []);
  
  const topUp = useCallback(async () => {
    const { hash } = await sendTransactionAsync();

    setIsTopUpModalOpen(false);
    
    console.log({ hash })

    const data = await toast.promise(
      waitForTransaction({
        hash,
      }),
      {
        pending: `Sending ${amount} ${symbol} to ${executionAddress}`,
        success: `Sent successfully`,
        error: {
          render({ error }) {
            logger.error(`Sending ${symbol}`, error);

            return 'Something went wrong. Try again later.';
          }
        },
      }
    );
    
    console.log({ data, hash });
    
    await toast.promise(
      deposit(chain.id, hash),
      {
        pending: `Deposit ${amount} ${symbol} to canister`,
        success: `Deposited successfully`,
        error: {
          render({ error }) {
            logger.error(`Depositing ${symbol}`, error);

            return 'Something went wrong. Try again later.';
          }
        },
      }
    );
    
    // todo: remove refetch balance and passing it, cause deposit do it
    // await refetchBalance();
  }, [amount, chain, executionAddress, sendTransactionAsync, refetchBalance]);
  
  return (
    <Modal
      title="Top Up"
      okButtonProps={{ disabled: currentChain.id !== chain.id || amount < DEFAULT_AMOUNT }}
      onOk={topUp}
      open={isTopUpModalOpen}
      onCancel={useCallback(() => setIsTopUpModalOpen(false), [])}
    >
      <div className={styles.topUpModal}>
        <Input
          value={amount}
          type="number"
          onChange={useCallback((e) => setAmount(e.target.value), [])}
        />
        
        {/*<Button*/}
        {/*  className={styles.topUpBtn}*/}
        {/*  disabled={currentChain.id !== chain.id || amount < DEFAULT_AMOUNT}*/}
        {/*  onClick={topUp}*/}
        {/*>*/}
        {/*  Top Up*/}
        {/*</Button>*/}
      </div>
    </Modal>
  )
};

export default TopUpModal;
