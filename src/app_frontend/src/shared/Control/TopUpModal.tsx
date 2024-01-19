import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  useSendTransaction,
  useSwitchNetwork,
  useNetwork,
  usePrepareSendTransaction,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi';
import { utils } from 'ethers';
import { Input, Modal, Flex } from 'antd';
import { waitForTransaction } from '@wagmi/core';
import logger from 'Utils/logger';
import { usePythiaData } from 'Providers/PythiaData';
import { DEFAULT_TOP_UP_AMOUNT } from 'Constants/ui';

interface TopUpModalProps {
  isTopUpModalOpen: boolean;
  setIsTopUpModalOpen: (val: boolean) => void;
  chain: any;
  executionAddress: string;
  refetchBalance: () => void;
  decimals: any;
  symbol: any;
}

const TopUpModal = ({
  isTopUpModalOpen,
  setIsTopUpModalOpen,
  chain,
  executionAddress,
  refetchBalance,
  decimals,
  symbol,
}: TopUpModalProps) => {
  const [amount, setAmount] = useState<string>(DEFAULT_TOP_UP_AMOUNT.toString());

  const { chain: currentChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { deposit } = usePythiaData();

  console.log({
    chain,
    executionAddress,
    decimals,
    amount,
  });

  // const { sendTransactionAsync } = useSendTransaction({
  //   to: executionAddress,
  //   value: utils.parseUnits(String(amount || 0), decimals),
  //   chainId: chain.id,
  // });

  // to use with sybil ?
  const { config: tokenSendConfig } = usePrepareContractWrite({
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    abi: [
      {
        name: 'transfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
      },
    ],
    functionName: 'transfer',
    args: [executionAddress, utils.parseUnits(String(amount || 0), 6)],
    enabled: Boolean('0xaf88d065e77c8cC2239327C5EDb3A432268e5831'),
  });

  const { writeAsync } = useContractWrite(tokenSendConfig);

  // const config = usePrepareSendTransaction({
  //   to: executionAddress,
  //   value: utils.parseUnits(String(amount || 0), decimals),
  //   chainId: chain.id,
  // });
  // const { sendTransactionAsync } = useSendTransaction({
  //   ...config.data ?? {},
  //   value: config.data?.value?.hex,
  // });

  useEffect(() => {
    if (currentChain?.id !== chain.id && switchNetwork) {
      switchNetwork(chain.id);
    }
  }, [chain.id, currentChain?.id, switchNetwork]);

  const topUp = useCallback(async () => {
    try {
      const { hash } = await writeAsync();

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
            render({ data }) {
              logger.error(`Sending ${symbol}`, data);

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
          render({ data }) {
            logger.error(`Depositing ${symbol}`, data);
            toast.error('Deposit failed. Try again later.');

            return 'Something went wrong. Try again later.';
          },
        },
      });

      await refetchBalance();
    } catch (error) {
      console.log({ error });
      toast.error('Something went wrong. Try again later.');
    }
  }, [amount, chain, executionAddress, writeAsync, refetchBalance]);

  return (
    <Modal
      style={{ top: '30%', right: '10px', maxWidth: '400px' }}
      title="Top Up"
      okButtonProps={{
        disabled: currentChain?.id !== chain.id || amount < DEFAULT_TOP_UP_AMOUNT.toString(),
      }}
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
