import { useState, useCallback, useMemo } from 'react';
import { useSwitchNetwork, useNetwork, useBalance, useAccount } from 'wagmi';
import { Input, Typography } from 'antd';

import { AllowedChain, AllowedToken } from 'Stores/useSybilBalanceStore';
import { DEFAULT_TOP_UP_AMOUNT, DEFAULT_TOP_UP_AMOUNT_ETH } from 'Constants/ui';
import { NewSelect } from 'Components/Select/NewSelect';
import { Modal } from 'Components/Modal';

interface TopUpModalProps {
  isOpen: boolean;
  onOpenChange: (e: any) => void;
  chains: AllowedChain[];
  isChainsLoading: boolean;
  tokens: AllowedToken[];
  submit: (chain: number, token: AllowedToken, amount: number) => void;
  setChain: (AllowedChain: any) => void;
  chain: AllowedChain;
}

export const TopUpModal = ({
  isOpen,
  onOpenChange,
  chains,
  isChainsLoading,
  tokens,
  submit,
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

  const handleSetChain = useCallback((newChain: AllowedChain) => {
    setChain(newChain);
    setToken(newChain.tokens[0]);
  }, [chain]);

  const actions = useMemo(() => [
    {
      label: 'Top Up',
      onPress: handleSubmit,
      variant: 'primary',
      disabled: Number(balance?.formatted) < amount || amount <= 0,
    },
  ], [balance?.formatted, handleSubmit, amount]);

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Top Up"
      // @ts-ignore
      actions={actions}
    >
      <>
        <NewSelect
          items={chains}
          handleChange={handleSetChain}
          selectedItem={chain}
          title="Chain"
        />

        <NewSelect
          items={tokens}
          handleChange={setToken}
          selectedItem={token}
          title="Token"
        />

        <Input
          type="number"
          value={amount}
          className="m-10 w-50"
          onChange={useCallback((e: any) => setAmount(Number(e.target.value)), [])}
        />

        <Typography.Text style={{ marginTop: '5px', color: 'gray' }}>
          Balance: {balance ? balance.formatted : '0'}
        </Typography.Text>
      </>
    </Modal>
  );
};
