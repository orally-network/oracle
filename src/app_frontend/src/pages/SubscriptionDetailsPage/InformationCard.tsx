import { CHAINS_MAP } from 'Constants/chains';
import { Subscription } from 'Interfaces/subscription';
import React from 'react';
import { Space, Card, Tooltip, Typography, Flex, Skeleton as AntdSkeleton } from 'antd';
import ChainLogo from 'Shared/ChainLogo';

import styles from './SubscriptionDetailsPage.scss';
import { add0x } from 'Utils/addressUtils';
import IconLink from 'Components/IconLink';
import { stopPropagation } from 'Utils/reactUtils';
import { ExportOutlined } from '@ant-design/icons';

interface InformationCardProps {
  subscription: Subscription;
}

const InformationCard = ({ subscription }: InformationCardProps) => {
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
  } = subscription;

  const chain = CHAINS_MAP[chain_id];
  const lastUpdateDateTime = new Date(Number(last_update) * 1000);

  return (
    <Card style={{ minHeight: '60vh', width: '40%', padding: '10px' }}>
      <Space size="middle" style={{ width: '100%', marginBottom: '20px' }}>
        <Flex className={styles.logo} align="center" justify="center">
          <ChainLogo chain={chain} />

          <div className={styles.status}>
            <Tooltip title={`Subscription is ${is_active ? '' : 'in'}active`}>
              <div className={is_active ? styles.active : styles.inactive} />
            </Tooltip>
          </div>
        </Flex>

        <Flex vertical>
          {chain.name}
          <Space>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {pair ? pair : 'Random'}
            </Typography.Title>
          </Space>
        </Flex>
      </Space>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Address */}
        <Flex vertical>
          <div className={styles.label}>Address</div>
          <Space size="middle">
            <Typography.Title level={5}>{contract_addr}</Typography.Title>
            {chain?.blockExplorers?.default?.url && (
              <IconLink
                onClick={stopPropagation}
                link={`${chain.blockExplorers.default.url}/address/${add0x(contract_addr)}`}
                IconComponent={ExportOutlined}
              />
            )}
          </Space>
        </Flex>

        {/* Owner */}
        <Flex vertical>
          <div className={styles.label}>Owner</div>
          <Typography.Title level={5}>{owner}</Typography.Title>
        </Flex>

        {/* Last execution */}
        <Flex vertical>
          <div className={styles.label}>Last execution</div>
          <Typography.Title level={5}>{lastUpdateDateTime.toLocaleString()}</Typography.Title>
        </Flex>

        {/* Method */}
        <Flex vertical>
          <div className={styles.label}>Method</div>
          <Typography.Title level={5}>{method_name}</Typography.Title>
        </Flex>

        {/* Gas limit */}
        <Flex vertical>
          <div className={styles.label}>Gas limit</div>
          <Typography.Title level={5}>{gas_limit.toString()}</Typography.Title>
        </Flex>

        {/* Data */}
        <Flex vertical>
          <div className={styles.label}>Data</div>
          <Typography.Title level={5}>?</Typography.Title>
        </Flex>
      </Space>
    </Card>
  );
};

const Skeleton = () => {
  return (
    <Card style={{ minHeight: '60vh', width: '40%', padding: '10px' }}>
      <AntdSkeleton active avatar paragraph={{ rows: 5 }} round loading />
    </Card>
  );
};

const Empty = () => {
  return (
    <Card style={{ minHeight: '60vh', width: '40%', padding: '10px' }}>
      <Typography.Title level={5}>No subscription found</Typography.Title>
    </Card>
  );
};

export default Object.assign(InformationCard, { Skeleton, Empty });
