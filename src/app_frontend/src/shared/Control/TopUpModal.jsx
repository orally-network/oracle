import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSendTransaction, useSwitchNetwork, useNetwork } from 'wagmi';
import { utils } from 'ethers';
import { Input, Modal, Flex } from 'antd';
import { waitForTransaction } from '@wagmi/core';
import logger from 'Utils/logger';
import { usePythiaData } from 'Providers/PythiaData';

const DEFAULT_AMOUNT = 0.01;

const TopUpModal = ({
  isTopUpModalOpen,
  setIsTopUpModalOpen,
  chain,
  executionAddress,
  refetchBalance,
  decimals,
  symbol,
}) => {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);

  const { chain: currentChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { deposit } = usePythiaData();

  console.log({
    chain,
    executionAddress,
    decimals,
    amount,
  });

  const { sendTransactionAsync } = useSendTransaction({
    to: executionAddress,
    value: utils.parseUnits(String(amount || 0), decimals),
    chainId: chain.id,
  });

  useEffect(() => {
    if (currentChain.id !== chain.id) {
      switchNetwork(chain.id);
    }
  }, [chain.id, currentChain.id, switchNetwork]);

  const topUp = useCallback(async () => {
    const { hash } = await sendTransactionAsync();

    setIsTopUpModalOpen(false);

    console.log({ hash, id: chain.id });

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
          },
        },
      }
    );

    console.log({ data, hash });

    await toast.promise(deposit(chain.id, hash), {
      pending: `Deposit ${amount} ${symbol} to canister`,
      success: `Deposited successfully`,
      error: {
        render({ error }) {
          logger.error(`Depositing ${symbol}`, error);

          return 'Something went wrong. Try again later.';
        },
      },
    });

    await refetchBalance();
  }, [amount, chain, executionAddress, sendTransactionAsync, refetchBalance]);

  return (
    <Modal
      maxWidth={400}
      style={{ top: '30%', right: '10px' }}
      title="Top Up"
      okButtonProps={{ disabled: currentChain.id !== chain.id || amount < DEFAULT_AMOUNT }}
      onOk={topUp}
      open={isTopUpModalOpen}
      onCancel={() => setIsTopUpModalOpen(false)}
    >
      <Flex vertical style={{ paddingTop: '20px' }}>
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Flex>
    </Modal>
  );
};

export default TopUpModal;
