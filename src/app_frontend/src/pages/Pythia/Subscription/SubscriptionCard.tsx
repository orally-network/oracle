import React, { useCallback, useEffect, useState } from 'react';
import { Space, Card, Tooltip, Typography, Flex, Drawer, Skeleton as AntdSkeleton } from 'antd';
import {
  ExportOutlined,
  UnorderedListOutlined,
  ArrowRightOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';

import Control from 'Shared/Control';
import { CHAINS_MAP } from 'Constants/chains';
import ChainLogo from 'Shared/ChainLogo';
import { add0x } from 'Utils/addressUtils';
import { usePythiaData } from 'Providers/PythiaData';
import { truncateEthAddress } from 'Utils/addressUtils';
import { stopPropagation } from 'Utils/reactUtils';
import Button from 'Components/Button';
import styles from './Subscription.scss';

import { BREAK_POINT_MOBILE, STROKE_DASHARRAY_PROGRESS_BAR } from 'Constants/ui';
import IconLink from 'Components/IconLink';
import { SubscriptionDetails } from './SubscriptionDetails';
import { Subscription } from 'Interfaces/subscription';
import useWindowDimensions from 'Utils/useWindowDimensions';

interface SubscriptionProps {
  sub: Subscription;
  addressData: {
    address: string;
    message: string;
    signature: string;
  };
  signMessage: (chainId: BigInt, subId: BigInt) => Promise<any>;
  stopSubscription: (chainId: BigInt, subId: BigInt) => void;
  startSubscription: (chainId: BigInt, subId: BigInt) => void;
  withdraw: (chainId: BigInt, subId: BigInt) => void;
}

const SubscriptionCard = ({
  sub,
  addressData,
  signMessage,
  stopSubscription,
  startSubscription,
  withdraw,
}: SubscriptionProps) => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [isSubscriptionDetailsVisible, setIsSubscriptionDetailsVisible] = useState<boolean>(false);

  const {
    status: { is_active, last_update, executions_counter },
    method: {
      chain_id,
      name: method_name,
      gas_limit,
      method_type: { Pair: pair, Random: random },
      exec_condition,
    },
    owner,
    contract_addr,
    id,
  } = sub;

  const chain = CHAINS_MAP[chain_id as number];
  const frequency = exec_condition[0]?.Frequency || BigInt(3600); // remove hardcoded value after exec_condition will be required

  const [balance, setBalance] = useState(0);

  const { pma, isBalanceLoading, fetchBalance } = usePythiaData();
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const refetchBalance = useCallback(async () => {
    const res: any = await fetchBalance(chain_id, addressData.address);
    setBalance(res);
  }, [chain_id, addressData]);

  useEffect(() => {
    if (chain_id && addressData) {
      refetchBalance();
    }
  }, [chain_id, addressData]);

  const lastUpdateDateTime = new Date(Number(last_update) * 1000);
  const nextUpdateDateTime = new Date(lastUpdateDateTime.getTime() + Number(frequency) * 1000);
  const diffMs = Math.abs(+new Date() - +nextUpdateDateTime);
  const progress = (diffMs * STROKE_DASHARRAY_PROGRESS_BAR) / (Number(frequency) * 1000);

  return (
    <Card hoverable={true} className={styles.subscription}>
      <Space size="middle" direction="vertical" style={{ width: '100%' }}>
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

          <div className={styles.menu} onClick={() => setIsSubscriptionDetailsVisible(true)}>
            {sub.owner === address?.toLowerCase?.() ? <EditOutlined /> : <EyeOutlined />}
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Address</div>

          <Space size="middle">
            <Typography.Title level={5}>
              {truncateEthAddress(add0x(contract_addr))}{' '}
            </Typography.Title>
            {chain?.blockExplorers?.default?.url && (
              <IconLink
                onClick={stopPropagation}
                link={`${chain.blockExplorers.default.url}/address/${add0x(contract_addr)}`}
                IconComponent={ExportOutlined}
              />
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
            <Tooltip
              placement="topRight"
              title={`Next update in ${new Date(diffMs).getMinutes()} min ${new Date(
                diffMs
              ).getSeconds()} sec`}
            >
              <div className={styles.progress}>
                <svg width="130" height="60" viewBox="0 0 130 70">
                  <path
                    className="percent test path"
                    d="M5,5 h107 a14,14 0 0 1 14,14 v35 a14,14 0 0 1 -14,14 h-107 a14,14 0 0 1 -14,-14 v-35 a14,14 0 0 1 14,-14 z"
                    fill="none"
                    stroke="#1766F9"
                    strokeWidth="1"
                    style={{
                      strokeDasharray: STROKE_DASHARRAY_PROGRESS_BAR,
                      strokeDashoffset: progress,
                    }}
                  />
                </svg>
              </div>
              Update time
              <Typography.Title level={5}>{Number(frequency) / 60} min</Typography.Title>
            </Tooltip>
          </div>
        </Flex>

        <Button
          type="primary"
          size="large"
          icon={<UnorderedListOutlined />}
          onClick={() => navigate(`/pythia/${chain_id}/${id}`)}
          style={{
            width: '100%',
          }}
        >
          View list
        </Button>
      </Space>

      {isSubscriptionDetailsVisible && (
        <Drawer
          title="Subscription details"
          placement="right"
          onClose={() => setIsSubscriptionDetailsVisible(false)}
          open={isSubscriptionDetailsVisible}
          style={{ paddingTop: '80px' }}
          width={isMobile ? '90vw' : '54vw'}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <SubscriptionDetails subscription={sub} />
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
          </Space>
        </Drawer>
      )}
    </Card>
  );
};

const Skeleton = () => {
  return (
    <Card hoverable={true} className={styles.subscription}>
      <AntdSkeleton active avatar paragraph={{ rows: 3 }} round loading />
    </Card>
  );
};

export default Object.assign(SubscriptionCard, { Skeleton });
