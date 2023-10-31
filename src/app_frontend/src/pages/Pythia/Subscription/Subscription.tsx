import React, { useCallback, useEffect, useState } from 'react';
import { Dropdown, Space, Card, Tooltip, Typography, Flex } from 'antd';
import type { MenuProps } from 'antd';
import {
  LinkOutlined,
  UnorderedListOutlined,
  ArrowRightOutlined,
  EllipsisOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAccount } from 'wagmi';
import { Link, useNavigate } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Control from 'Shared/Control';
import { CHAINS_MAP } from 'Constants/chains';
import ChainLogo from 'Shared/ChainLogo';
import { add0x } from 'Utils/addressUtils';
import { usePythiaData } from 'Providers/PythiaData';
import { truncateEthAddress } from 'Utils/addressUtils';
import { stopPropagation } from 'Utils/reactUtils';
import Button from 'Components/Button';

import styles from './Subscription.scss';
import { SecondaryButton } from 'Components/SecondaryButton';
import { STROKE_DASHARRAY_PROGRESS_BAR } from 'Constants/ui';

const contextMenuItems: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
    icon: <UserOutlined />,
  },
  {
    label: '2nd menu item',
    key: '2',
    icon: <UserOutlined />,
  },
];

const Data = ({ pair, random }) => {
  if (pair) {
    return (
      <Link to={`/sybil/${pair}`} onClick={stopPropagation}>
        <Button className={styles.data}>{pair}</Button>
      </Link>
    );
  }

  return <Button className={styles.data}>Random ({random})</Button>;
};

const Subscription = ({
  sub,
  addressData,
  signMessage,
  stopSubscription,
  startSubscription,
  withdraw,
}) => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);

  const {
    status: { is_active, last_update, executions_counter },
    method: {
      chain_id,
      name: method_name,
      gas_limit,
      method_type: { Pair: pair, Random: random },
    },
    owner,
    contract_addr,
    frequency,
    id,
  } = sub;

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
  };

  const chain = CHAINS_MAP[chain_id];

  const [balance, setBalance] = useState(0);

  const { pma, isBalanceLoading, fetchBalance } = usePythiaData();

  const refetchBalance = useCallback(async () => {
    setBalance(await fetchBalance(chain_id, addressData.address));
  }, [chain_id, addressData]);

  useEffect(() => {
    if (chain_id && addressData) {
      refetchBalance();
    }
  }, [chain_id, addressData]);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  const lastUpdateDateTime = new Date(Number(last_update) * 1000);
  const nextUpdateDateTime = new Date(lastUpdateDateTime.getTime() + Number(frequency) * 1000);
  const diffMs = Math.abs(+new Date() - +nextUpdateDateTime);
  const progress = (diffMs * STROKE_DASHARRAY_PROGRESS_BAR) / (Number(frequency) * 1000);

  return (
    <Card hoverable={true} className={styles.subscription}>
      <Space size="middle" direction="vertical">
        <div className={styles.header}>
          <Flex className={styles.logo} align="center" justify="center">
            <ChainLogo chain={chain} />

            <div className={styles.status}>
              <Tooltip title={`Subscription is ${is_active ? '' : 'in'}active`}>
                <div className={is_active ? styles.active : styles.inactive} />
              </Tooltip>
            </div>
          </Flex>

          <div className={styles.info}>
            <div>{chain.name}</div>
            <Space>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {pair ? pair : 'Random'}
              </Typography.Title>
              <Button
                size="small"
                type="text"
                style={{ color: '#1766F9' }}
                icon={<ArrowRightOutlined />}
                onClick={() => navigate(`/sybil/${id}`)}
              />
            </Space>
          </div>

          <div className={styles.menu}>
            <Dropdown menu={{ items: contextMenuItems }}>
              <Button type="text" style={{ color: '#1766F9' }}>
                <Space>
                  <EllipsisOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Address</div>

          <Space size="middle">
            <Typography.Title level={5}>
              {truncateEthAddress(add0x(contract_addr))}{' '}
            </Typography.Title>
            {chain?.blockExplorers?.default?.url && (
              <div>
                <CopyToClipboard text={contract_addr} onCopy={() => setIsCopied(true)}>
                  <SecondaryButton icon={<LinkOutlined />} />
                </CopyToClipboard>

                <Tooltip placement="bottom" title="Copied" open={isCopied} />
              </div>
            )}
          </Space>
        </div>

        <Flex justify="space-between" gap="middle">
          <div className={styles.stat}>
            Repetitions
            <br />
            <Typography.Title level={5}>{Number(executions_counter)}</Typography.Title>
          </div>

          <div className={styles.stat}>
            <div className={styles.progress}>
              <svg width="130" height="60" viewBox="0 0 130 70">
                <path
                  className="percent test path"
                  d="M5,5 h107 a14,14 0 0 1 14,14 v35 a14,14 0 0 1 -14,14 h-107 a14,14 0 0 1 -14,-14 v-35 a14,14 0 0 1 14,-14 z"
                  fill="none"
                  stroke="#1766F9"
                  stroke-width="1"
                  style={{
                    strokeDasharray: STROKE_DASHARRAY_PROGRESS_BAR,
                    strokeDashoffset: progress,
                  }}
                />
              </svg>
            </div>
            Update time
            <Typography.Title level={5}>
              {new Date(diffMs).getMinutes()}min {new Date(diffMs).getSeconds()} sec
            </Typography.Title>
          </div>
        </Flex>

        <Button
          type="primary"
          size="large"
          icon={<UnorderedListOutlined />}
          onClick={() => navigate(`/pythia/${id}`)}
          style={{
            width: '100%',
          }}
        >
          View list
        </Button>
      </Space>

      {owner === address?.toLowerCase() && (
        <Control
          subscribed
          is_active={is_active}
          addressData={addressData}
          signMessage={signMessage}
          chain={chain}
          subId={id}
          balance={balance}
          executionAddress={pma}
          isBalanceLoading={isBalanceLoading}
          startSubscription={startSubscription}
          refetchBalance={refetchBalance}
          stopSubscription={stopSubscription}
          withdraw={withdraw}
        />
      )}
    </Card>
  );
};

export default Subscription;
