import React, { useState, useCallback } from 'react';
import { useSwitchNetwork, useNetwork, useBalance, useAccount } from 'wagmi';
import { Input, Modal, Flex, Typography } from 'antd';

import { AllowedChain, AllowedToken } from 'Stores/useSybilBalanceStore';
import { DEFAULT_TOP_UP_AMOUNT, DEFAULT_TOP_UP_AMOUNT_ETH } from 'Constants/ui';
import { SingleValueSelect } from 'Components/Select';

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
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address } = useAccount();

  const [token, setToken] = useState<AllowedToken>(chain.tokens[0]);
  const [amount, setAmount] = useState<number>(chain.tokens[0].symbol === 'ETH' ? DEFAULT_TOP_UP_AMOUNT_ETH : DEFAULT_TOP_UP_AMOUNT);

  const { data: balance } = useBalance({
    chainId: Number(chain.chainId),
    token: token.address,
    address,
  });

  const handleSubmit = useCallback(async () => {
    if (currentChain?.id && currentChain?.id !== chain.chainId) {
      if (switchNetworkAsync) {
        await switchNetworkAsync(chain.chainId);
      }
    }

    submit(chain.chainId, token, amount);
  }, [chain.chainId, token, amount]);

  const handleSetChain = useCallback((chain: AllowedChain) => {
    setChain(chain);
    setToken(chain.tokens[0]);
  }, []);

  return (
    <Modal
      style={{ top: '30%', right: '10px', maxWidth: '400px' }}
      title="Top Up"
      okButtonProps={{
        disabled: Number(balance?.formatted) < amount || amount <= 0,
      }}
      onOk={handleSubmit}
      open={isOpen}
      onCancel={close}
      confirmLoading={isConfirming}
    >
      <Flex vertical style={{ margin: '20px 0' }}>
        <Flex style={{ marginBottom: '20px' }} justify="space-around">
          <SingleValueSelect
            className="w-170"
            classNamePrefix="react-select"
            options={chains}
            value={chain}
            onChange={handleSetChain}
            placeholder="Chain"
            isLoading={isChainsLoading}
          />

          <SingleValueSelect
            isToken
            className="w-170"
            classNamePrefix="react-select"
            options={tokens}
            onChange={setToken}
            value={token}
            placeholder="Token"
            isLoading={isChainsLoading}
          />
        </Flex>

        <Input
          type="number"
          value={amount}
          className="m-10 w-50"
          onChange={useCallback((e: any) => setAmount(Number(e.target.value)), [])}
        />

        <Typography.Text style={{ marginTop: '5px', color: 'gray' }}>
          Balance: {balance ? balance.formatted : '0'}
        </Typography.Text>
      </Flex>
    </Modal>
  );
};
