import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Spin, Flex } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Connect from 'Shared/Connect';
import { truncateEthAddress } from 'Utils/addressUtils';

import { TopUpPythiaModal, TopUpSybilModal } from './TopUpModal';
import styles from './Control.module.scss';
import { SecondaryButton } from 'Components/SecondaryButton';
import { SignInButton } from 'Shared/SignInButton';

import { SubscribeButtons } from './SubscribeButtons';

interface ControlProps {
  addressData: {
    address: string;
    signature: string;
  };
  chain: any;
  decimals: any;
  symbol: any;
  balance: any;
  executionAddress: any;
  refetchBalance: any;
  isBalanceLoading: boolean;
  subscribe?: () => void;
  disabled?: boolean;
  subscribed?: boolean;
  subId?: BigInt;
  stopSubscription?: any;
  startSubscription?: any;
  withdraw?: any;
  is_active?: boolean;
  isPythia: boolean;
}

// todo: subscribed will have `stop` and `withdraw` methods
const Control = ({
  addressData,
  chain,
  subscribe,
  subscribed,
  disabled,
  subId,
  stopSubscription,
  startSubscription,
  withdraw,
  is_active,
  balance,
  executionAddress,
  refetchBalance,
  isBalanceLoading,
  decimals,
  symbol,
  isPythia,
}: ControlProps) => {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const { address } = useAccount();

  if (!address) {
    return <Connect />;
  }

  if (!addressData || !addressData.signature) {
    return <SignInButton chain={chain} />;
  }

  const formattedBalance = (Number(balance) / Math.pow(10, decimals ?? chain.nativeCurrency.decimals)).toFixed(3);

  return (
    <div className={styles.control}>
      <Flex justify="space-between" gap="small">
        <Spin spinning={isBalanceLoading}>
          <div className={styles.executionAddressInfo}>
            Pythia Main Address
            <div
              className={styles.address}
              onClick={() => navigator.clipboard.writeText(executionAddress)}
            >
              {truncateEthAddress(executionAddress)}
            </div>
          </div>
        </Spin>

        <SecondaryButton
          icon={<DownloadOutlined />}
          className={styles.topUp}
          onClick={() => setIsTopUpModalOpen(true)}
        >
          Top up
        </SecondaryButton>
      </Flex>

      <div className={styles.balance}>
        {formattedBalance}
        {isPythia ? chain.nativeCurrency.symbol : 'USDC'}
      </div>

      <SubscribeButtons
        balance={balance}
        subscribed={subscribed}
        subscribe={subscribe}
        isActive={is_active}
        stopSubscription={stopSubscription}
        startSubscription={startSubscription}
        refetchBalance={refetchBalance}
        withdraw={withdraw}
        disabled={disabled}
        chain={chain}
        subId={subId}
      />

      {isTopUpModalOpen && isPythia ? (
        <TopUpPythiaModal
          isTopUpModalOpen={isTopUpModalOpen}
          setIsTopUpModalOpen={setIsTopUpModalOpen}
          chain={chain}
          executionAddress={executionAddress}
          refetchBalance={refetchBalance}
          decimals={decimals}
          symbol={symbol}
        />
      ) : (
        <TopUpSybilModal
          isTopUpModalOpen={isTopUpModalOpen}
          setIsTopUpModalOpen={setIsTopUpModalOpen}
          chain={chain}
          executionAddress={executionAddress}
          refetchBalance={refetchBalance}
          decimals={decimals}
          symbol={symbol}
        />
      )}
    </div>
  );
};

export default Control;
