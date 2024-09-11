import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSendTransaction, useAccount, useSwitchChain, useConfig } from 'wagmi';
import { utils } from 'ethers';
import { Input, Modal, Flex } from 'antd';
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import logger from 'Utils/logger';
import { usePythiaData } from 'Providers/PythiaData';
import { DEFAULT_TOP_UP_AMOUNT } from 'Constants/ui';
import sybilCanister from 'Canisters/sybilCanister';
import { GeneralResponse } from 'Interfaces/common';
import { useDeposit } from 'Services/sybilService';

const USDC_TOKEN_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
const ARBITRUM_CHAIN_ID = 42161;

interface TopUpWrapperProps {
  isTopUpModalOpen: boolean;
  setIsTopUpModalOpen: (val: boolean) => void;
  chain: any;
  executionAddress: string;
  refetchBalance: () => void;
  decimals: any;
  symbol: any;
}

interface TopUpModalProps extends TopUpWrapperProps {
  amount: string;
  setAmount: (val: string) => void;
  topUp: () => void;
  isConfirming: boolean;
}

// todo: deprecated
const TopUpModal = ({
  isTopUpModalOpen,
  setIsTopUpModalOpen,
  chain,
  executionAddress,
  decimals,
  amount,
  setAmount,
  topUp,
  isConfirming,
}: TopUpModalProps) => {
  const { chain: currentChain } = useAccount();
  const { switchChain } = useSwitchChain();

  console.log({
    chain,
    executionAddress,
    decimals,
    amount,
  });

  useEffect(() => {
    if (currentChain?.id !== chain.id && switchChain) {
      switchChain({ chainId: chain.id });
    }
  }, [chain.id, currentChain?.id, switchChain]);

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
      confirmLoading={isConfirming}
    >
      <Flex vertical style={{ paddingTop: '20px' }}>
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Flex>
    </Modal>
  );
};

export const TopUpSybilModal = (props: TopUpWrapperProps) => {
  const [amount, setAmount] = useState<string>(DEFAULT_TOP_UP_AMOUNT.toString());
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const config = useConfig();

  const { mutate: deposit } = useDeposit();

  // todo: use makeDepositTransfer
  const sendStablecoins = useCallback(async () => {
    const sybilEthAddress: GeneralResponse = await sybilCanister.eth_address();
    return writeContract(config, {
      address: USDC_TOKEN_ADDRESS,
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
      args: [sybilEthAddress.Ok, utils.parseUnits(String(amount || 0), 6)],
      chainId: ARBITRUM_CHAIN_ID,
    });
  }, [amount]);

  const topUp = useCallback(async () => {
    setIsConfirming(true);
    try {
      const hash = await sendStablecoins();
      console.log({ hash });

      props.setIsTopUpModalOpen(false);

      console.log({ hash, id: props.chain.id });

      const data = await toast.promise(
        waitForTransactionReceipt(config, {
          hash,
        }),
        {
          pending: `Sending ${amount} ${props.symbol} to ${props.executionAddress}`,
          success: `Sent successfully`,
          error: {
            render({ data }) {
              logger.error(`Sending ${props.symbol}`, data);

              return 'Something went wrong. Try again later.';
            },
          },
        },
      );

      console.log({ data, hash });

      deposit({
        chainId: ARBITRUM_CHAIN_ID,
        tx_hash: hash,
      });
    } catch (error) {
      console.log({ error });
      toast.error('Something went wrong. Try again later.');
    } finally {
      setIsConfirming(false);
    }
  }, [amount, props.chain, props.executionAddress, sendStablecoins, props.refetchBalance, deposit]);

  return (
    <TopUpModal
      {...props}
      topUp={topUp}
      amount={amount}
      setAmount={setAmount}
      isConfirming={isConfirming}
    />
  );
};

export const TopUpPythiaModal = (props: TopUpWrapperProps) => {
  const [amount, setAmount] = useState<string>(DEFAULT_TOP_UP_AMOUNT.toString());
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const { deposit } = usePythiaData();
  const config = useConfig();

  const { sendTransactionAsync } = useSendTransaction({
    // chainId: props.chain.id,
  });

  const topUp = useCallback(async () => {
    setIsConfirming(true);
    try {
      const hash = await sendTransactionAsync({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        to: props.executionAddress,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        value: utils.parseUnits(String(amount || 0), props.decimals),
      });

      props.setIsTopUpModalOpen(false);

      console.log({ hash, id: props.chain.id });

      const data = await toast.promise(
        waitForTransactionReceipt(config, {
          hash,
        }),
        {
          pending: `Sending ${amount} ${props.symbol} to ${props.executionAddress}`,
          success: `Sent successfully`,
          error: {
            render({ data }) {
              logger.error(`Sending ${props.symbol}`, data);

              return 'Something went wrong. Try again later.';
            },
          },
        },
      );

      console.log({ data, hash });

      await toast.promise(deposit(props.chain.id, hash), {
        pending: `Deposit ${amount} ${props.symbol} to canister`,
        success: `Deposited successfully`,
        error: {
          render({ data }) {
            logger.error(`Depositing ${props.symbol}`, data);

            return 'Deposit failed. Try again later.';
          },
        },
      });

      await props.refetchBalance();
    } catch (error) {
      console.log({ error });
      toast.error('Something went wrong. Try again later.');
    } finally {
      setIsConfirming(false);
    }
  }, [amount, props.chain, props.executionAddress, sendTransactionAsync, props.refetchBalance]);

  return (
    <TopUpModal
      {...props}
      topUp={topUp}
      amount={amount}
      setAmount={setAmount}
      isConfirming={isConfirming}
    />
  );
};
