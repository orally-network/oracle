import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Spin, Flex } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Connect from 'Shared/Connect';
import { truncateEthAddress } from 'Utils/addressUtils';

import TopUpModal from './TopUpModal';
import styles from './Control.scss';
import { SecondaryButton } from 'Components/SecondaryButton';
import { SignInButton } from 'Shared/SignInButton';

import { SubscribeButtons } from './SubscribeButtons';

interface ControlProps {
  addressData: {
    address: string;
    signature: string;
  };
  chain: any;
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
}: ControlProps) => {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const { address } = useAccount();

  if (!address) {
    return <Connect />;
  }

  if (!addressData) {
    return <SignInButton chain={chain} />;
  }

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
        {(Number(balance) / Math.pow(10, chain.nativeCurrency.decimals)).toFixed(3) ?? '-'}{' '}
        {chain.nativeCurrency.symbol}
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

      {isTopUpModalOpen && (
        <TopUpModal
          isTopUpModalOpen={isTopUpModalOpen}
          setIsTopUpModalOpen={setIsTopUpModalOpen}
          chain={chain}
          executionAddress={executionAddress}
          refetchBalance={refetchBalance}
          decimals={chain.nativeCurrency.decimals}
          symbol={chain.nativeCurrency.symbol}
        />
      )}
    </div>
  );
};

export default Control;
