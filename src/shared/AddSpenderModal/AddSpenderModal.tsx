import { useState, useCallback, useMemo } from 'react';
import { Input } from '@nextui-org/react';
import { type Address } from 'viem';

import { NewSelect } from 'Components/Select/NewSelect';
import { Modal } from 'Components/Modal';
import { AllowedChain } from 'Interfaces/common';

interface TopUpModalProps {
  isOpen: boolean;
  onOpenChange: (e: any) => void;
  chains: AllowedChain[];
  submit: (chain: number, spenderAddress: Address) => void;
  setChain: (AllowedChain: any) => void;
  chain: AllowedChain;
}

export const AddSpenderModal = ({
  isOpen,
  onOpenChange,
  chains,
  submit,
  setChain,
  chain,
}: TopUpModalProps) => {
  const [spenderAddress, setSpenderAddress] = useState<Address>(`0x`);

  const actions = useMemo(() => [
    {
      label: 'Add Spender',
      onPress: () => submit(chain.chainId, spenderAddress),
      variant: 'primary',
      disabled: !spenderAddress,
    },
  ], [spenderAddress, chain.chainId]);

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Add Spender"
      // @ts-ignore
      actions={actions}
    >
      <>
        <NewSelect
          items={chains}
          handleChange={setChain}
          selectedItem={chain}
          title="Chain"
        />

        <Input
          type="string"
          label="Spender Address"
          variant="bordered"
          value={spenderAddress}
          onChange={useCallback((e: any) => setSpenderAddress(e.target.value), [])}
        />
      </>
    </Modal>
  );
};
