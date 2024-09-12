import { useTokenBalance } from 'Services/wagmiService';
import { useState, useCallback, useMemo } from 'react';
import { useSwitchChain, useAccount } from 'wagmi';
import { Input } from '@nextui-org/react';
import { type Address } from 'viem';

import { DEFAULT_TOP_UP_AMOUNT, DEFAULT_TOP_UP_AMOUNT_ETH } from 'Constants/ui';
import { NewSelect } from 'Components/Select/NewSelect';
import { Modal } from 'Components/Modal';
import { AllowedChain, AllowedToken } from 'Interfaces/common';

interface TopUpModalProps {
  isOpen: boolean;
  onOpenChange: (e: any) => void;
  chains: AllowedChain[];
  isChainsLoading?: boolean;
  tokens: AllowedToken[];
  submit: (chain: number, token: AllowedToken, amount: number) => void;
  setChain: (AllowedChain: any) => void;
  chain: AllowedChain;
  token?: AllowedToken;
  setToken?: (AllowedToken: any) => void;
}

export const TopUpModal = ({
  isOpen,
  onOpenChange,
  chains,
  tokens,
  submit,
  setChain,
  chain,
  token,
  setToken,
}: TopUpModalProps) => {
  const { switchChainAsync } = useSwitchChain();
  const { address, chain: currentChain } = useAccount();

  const [amount, setAmount] = useState<number>(
    token?.symbol === 'ETH' ? DEFAULT_TOP_UP_AMOUNT_ETH : DEFAULT_TOP_UP_AMOUNT,
  );

  const { balance } = useTokenBalance({
    tokenAddress: token?.address,
    address: address as Address,
    chainId: chain.chainId,
    enabled: Boolean(token?.address && isOpen && address),
  });

  const handleSubmit = useCallback(async () => {
    if (currentChain?.id && currentChain?.id !== chain.chainId) {
      if (switchChainAsync) {
        await switchChainAsync({ chainId: chain.chainId });
      }
    }

    if (token) {
      submit(chain.chainId, token, amount);
    }
  }, [chain.chainId, token, amount]);

  const actions = useMemo(
    () => [
      {
        label: 'Top Up',
        onPress: handleSubmit,
        variant: 'primary',
        disabled: !balance || Number(balance?.formatted) < amount || amount <= 0,
      },
    ],
    [balance?.formatted, handleSubmit, amount],
  );

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Top Up"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      actions={actions}
    >
      <>
        <NewSelect items={chains} handleChange={setChain} selectedItem={chain} title="Chain" />

        <NewSelect items={tokens} handleChange={setToken} selectedItem={token} title="Token" />

        <Input
          type="number"
          label="Amount"
          variant="bordered"
          value={String(amount)}
          onChange={useCallback((e: any) => setAmount(Number(e.target.value)), [])}
        />

        <div className="text-sm text-default-500">Balance: {balance ? balance.formatted : '0'}</div>
      </>
    </Modal>
  );
};
