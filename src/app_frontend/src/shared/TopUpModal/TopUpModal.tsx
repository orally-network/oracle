import React, { useState, useCallback } from 'react';
import { useSwitchNetwork, useNetwork } from 'wagmi';
import { Input, Modal, Flex } from 'antd';

import { AllowedChain, AllowedToken } from 'Stores/useSybilBalanceStore';
import { DEFAULT_TOP_UP_AMOUNT } from 'Constants/ui';
import { SingleValueSelect } from 'Components/Select';

import styles from './TopUpModal.scss';

interface TopUpModalProps {
  isOpen: boolean;
  close: (e: any) => void;
  chains: AllowedChain[];
  isChainsLoading: boolean;
  tokens: AllowedToken[];
  submit: (chain: number, token: AllowedToken, amount: number) => void;
  isConfirming: boolean;
  setChain: (AllowedChain: any) => void;
  chain: AllowedChain;
}

export const TopUpModal = ({
  isOpen,
  close,
  chains,
  isChainsLoading,
  tokens,
  submit,
  isConfirming,
  setChain,
  chain,
}: TopUpModalProps) => {
  const { chain: currentChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [token, setToken] = useState<AllowedToken>(chain.tokens[0]);
  const [amount, setAmount] = useState<number>(DEFAULT_TOP_UP_AMOUNT);

  const handleSubmit = useCallback(() => {
    if (currentChain?.id && currentChain?.id !== chain.chainId) {
      if (switchNetwork) {
        switchNetwork(chain.chainId);
      }
    }

    submit(chain.chainId, token, amount);
  }, [chain.chainId, token, amount]);

  return (
    <Modal
      style={{ top: '30%', right: '10px', maxWidth: '400px' }}
      title="Top Up"
      okButtonProps={{
        disabled: currentChain?.id !== chain.chainId || amount < DEFAULT_TOP_UP_AMOUNT,
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
          options={chains}
          value={chain}
          onChange={setChain}
          placeholder="Chain"
          isLoading={isChainsLoading}
        />

        <SingleValueSelect
          isToken
          className={styles.chainSelect}
          classNamePrefix="react-select"
          options={tokens}
          onChange={setToken}
          value={token}
          placeholder="Token"
          isLoading={isChainsLoading}
        />

        <Input
          type="number"
          value={amount}
          onChange={useCallback((e: any) => setAmount(Number(e.target.value)), [])}
        />
      </Flex>
    </Modal>
  );
};
