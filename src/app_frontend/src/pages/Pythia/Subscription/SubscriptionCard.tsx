import React, { useCallback, useEffect, useState } from 'react';
import {
  Progress,
  Space,
  Card,
  Tooltip,
  Typography,
  Flex,
  Drawer,
  Skeleton as AntdSkeleton,
} from 'antd';
import {
  ExportOutlined,
  CopyOutlined,
  RightOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';

import Control from 'Shared/Control';
import { CHAINS_MAP } from 'Constants/chains';
import ChainLogo from 'Shared/ChainLogo';
import { add0x, isAddressHasOx } from 'Utils/addressUtils';
import { usePythiaData } from 'Providers/PythiaData';
import { truncateEthAddress } from 'Utils/addressUtils';
import { stopPropagation } from 'Utils/reactUtils';
import Button from 'Components/Button';
import styles from './Subscription.scss';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import IconLink from 'Components/IconLink';
import { SubscriptionDetails } from './SubscriptionDetails';
import { Subscription } from 'Interfaces/subscription';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { GeneralResponse } from 'Interfaces/common';

interface SubscriptionProps {
  sub: Subscription;
  addressData: {
    address: string;
    message: string;
    signature: string;
  };
  stopSubscription: (chainId: BigInt, subId: BigInt) => Promise<GeneralResponse>;
  startSubscription: (chainId: BigInt, subId: BigInt) => Promise<GeneralResponse>;
  withdraw: (chainId: BigInt, subId: BigInt) => Promise<GeneralResponse>;
}

const SubscriptionCard = ({
  sub,
  addressData,
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
      method_type: { Feed: feed, Random: random },
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
  const progress = (diffMs * 100) / (Number(frequency) * 1000);

  return (
    <Card hoverable={true} className={styles.subscription}>
      <Space size="small" direction="vertical" style={{ width: '100%' }}>
        <div className={styles.header}>
          <div className={styles.info}>
            <div>{chain.name}</div>
            <Space>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {feed ? feed : 'Random'}
              </Typography.Title>
            </Space>
            <Typography.Text className={styles.sybilLink} onClick={() => navigate(`/sybil/${id}`)}>
              DATA FEED <RightOutlined size={4} />
            </Typography.Text>
          </div>

          <div className={styles.menu} onClick={() => setIsSubscriptionDetailsVisible(true)}>
            {sub.owner === address?.toLowerCase?.() ? <EditOutlined /> : <EyeOutlined />}
          </div>
        </div>
        <div
          className={styles.logoBg}
          style={{
            backgroundImage: `url('/${is_active ? 'active' : 'inactive'}-bg.svg')`,
          }}
        >
          <Flex className={styles.logo} align="center" justify="center">
            <ChainLogo chain={chain} />

            <div className={styles.status}>
              <Tooltip title={`Subscription is ${is_active ? '' : 'in'}active`}>
                <div className={is_active ? styles.active : styles.inactive} />
              </Tooltip>
            </div>
          </Flex>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Address</div>

          <Flex gap={2} justify="space-between">
            <Typography.Title level={5}>
              {truncateEthAddress(add0x(contract_addr))}{' '}
            </Typography.Title>
            <Space size={5}>
              <IconLink
                link={null}
                IconComponent={CopyOutlined}
                onClick={() => navigator.clipboard.writeText(isAddressHasOx(contract_addr))}
              />

              {chain?.blockExplorers?.default?.url && (
                <IconLink
                  onClick={stopPropagation}
                  link={`${chain.blockExplorers.default.url}/address/${add0x(contract_addr)}`}
                  IconComponent={ExportOutlined}
                />
              )}
            </Space>
          </Flex>
        </div>

        <Flex justify="space-between" gap={10}>
          <div className={styles.stat}>
            Update time <br />
            <Typography.Title level={5}>
              {new Date(diffMs).getMinutes()} min {new Date(diffMs).getSeconds()} sec
            </Typography.Title>
            <div className={styles.progress}>
              <Progress percent={progress} showInfo={false} strokeColor="#1890FF" size={[92, 2]} />
            </div>
          </div>
          <div className={styles.stat}>
            Repetitions
            <br />
            <Typography.Title level={5}>{Number(executions_counter)}</Typography.Title>
          </div>
        </Flex>

        <Button
          type="text"
          size="large"
          onClick={() => navigate(`/pythia/${chain_id}/${id}`)}
          style={{
            width: '100%',
            fontSize: '14px',
          }}
        >
          View subscription
        </Button>
      </Space>

      {isSubscriptionDetailsVisible && (
        <Drawer
          title="Subscription details"
          placement="right"
          onClose={() => setIsSubscriptionDetailsVisible(false)}
          open={isSubscriptionDetailsVisible}
          style={{ marginTop: '47px' }}
          width={isMobile ? '90vw' : '362px'}
        >
          <Space
            direction="vertical"
            size="middle"
            style={{ width: '100%', paddingBottom: '60px' }}
          >
            <SubscriptionDetails subscription={sub} />
            {owner === address?.toLowerCase() && (
              <Control
                subscribed
                is_active={is_active}
                addressData={addressData}
                chain={chain}
                subId={id}
                balance={balance}
                executionAddress={pma}
                isBalanceLoading={isBalanceLoading}
                startSubscription={startSubscription}
                refetchBalance={refetchBalance}
                stopSubscription={stopSubscription}
                withdraw={withdraw}
                isPythia={true}
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
      <AntdSkeleton active paragraph={{ rows: 7 }} round loading />
    </Card>
  );
};

export default Object.assign(SubscriptionCard, { Skeleton });
