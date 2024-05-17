import { Address } from '@wagmi/core';
import React, { useState, useCallback } from 'react';
import { mapChainsToOptions, mapTokensToOptions } from 'Utils/helper';
import { useSwitchNetwork, useNetwork } from 'wagmi';
import { Input, Modal, Flex } from 'antd';
import { DEFAULT_TOP_UP_AMOUNT } from 'Constants/ui';
import { SingleValueSelect } from 'Components/Select';

import styles from './TopUpModal.scss';

interface TopUpModalProps {
  isOpen: boolean;
  close: (e: any) => void;
  chains: any[];
  isChainsLoading: boolean;
  tokens: any[];
  targetAddress: string;
  submit: (chain: number, token: Address, amount: number) => void;
  isConfirming: boolean;
}

export const TopUpModal = ({
  isOpen,
  close,
  targetAddress,
  chains,
  isChainsLoading,
  tokens,
  submit,
  isConfirming,
}: TopUpModalProps) => {
  const { chain: currentChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [chainId, setChainId] = useState<number>(1);
  const [token, setToken] = useState<Address>('0x');
  const [amount, setAmount] = useState<number>(DEFAULT_TOP_UP_AMOUNT);

  // console.log({
  //   targetAddress,
  //   chains,
  //   tokens,
  // });

  const handleSubmit = useCallback(() => {
    if (currentChain?.id && currentChain?.id !== chainId) {
      if (switchNetwork) {
        switchNetwork(chainId);
      }
    }

    submit(chainId, token, amount);
  }, [chainId, token, amount]);

  return (
    <Modal
      style={{ top: '30%', right: '10px', maxWidth: '400px' }}
      title="Top Up"
      okButtonProps={{
        disabled: currentChain?.id !== chainId || amount < DEFAULT_TOP_UP_AMOUNT,
      }}
      onOk={handleSubmit}
      open={isOpen}
      onCancel={close}
      confirmLoading={isConfirming}
    >
      <Flex vertical style={{ paddingTop: '20px' }}>
        <SingleValueSelect
          className={styles.chainSelect}
          classNamePrefix="react-select"
          options={mapChainsToOptions(chains)}
          onChange={setChainId}
          placeholder="Chain"
          isLoading={isChainsLoading}
        />

        <SingleValueSelect
          className={styles.chainSelect}
          classNamePrefix="react-select"
          options={mapTokensToOptions(tokens)}
          onChange={setToken}
          placeholder="Token"
          isLoading={isChainsLoading}
        />

        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </Flex>
    </Modal>
  );
};
