import { CHAINS_MAP } from 'Constants/chains';
import { Subscription } from 'Interfaces/subscription';
import React from 'react';
import {
  Space,
  Card,
  Tooltip,
  Typography,
  Flex,
  Skeleton as AntdSkeleton,
  Button,
  Progress,
} from 'antd';
import ChainLogo from 'Shared/ChainLogo';

import styles from './SubscriptionDetailsPage.scss';
import { add0x, isAddressHasOx, truncateEthAddress } from 'Utils/addressUtils';
import IconLink from 'Components/IconLink';
import { stopPropagation } from 'Utils/reactUtils';
import { CopyOutlined, ExportOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { getStrMethodArgs } from 'Utils/helper';

interface InformationCardProps {
  subscription: Subscription;
}

const InformationCard = ({ subscription }: InformationCardProps) => {
  const { width } = useWindowDimensions();

  const isMobile = width < BREAK_POINT_MOBILE;
  const navigate = useNavigate();
  const {
    id,
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
  } = subscription;

  const chain = CHAINS_MAP[chain_id as number];
  const lastUpdateDateTime = new Date(Number(last_update) * 1000);
  const frequency = exec_condition[0]?.Frequency || BigInt(3600);

  const nextUpdateDateTime = new Date(lastUpdateDateTime.getTime() + Number(frequency) * 1000);
  const diffMs = Math.abs(+new Date() - +nextUpdateDateTime);
  const progress = (diffMs * 100) / (Number(frequency) * 1000);

  return (
    <Flex gap="middle" className={styles.information} vertical={isMobile}>
      <Space direction="vertical" size="middle" style={{ flex: 1 }}>
        <Flex style={{ width: '100%' }} vertical={isMobile}>
          <Flex gap="middle" style={{ width: '100%' }} align="stretch" vertical={isMobile}>
            <div className={styles.chainBg}>
              <Flex vertical gap="small" align="center">
                <Flex className={styles.logo} align="center" justify="center">
                  <ChainLogo chain={chain} size="large" />
                  <div className={styles.status}>
                    <Tooltip title={`Subscription is ${is_active ? '' : 'in'}active`}>
                      <div className={is_active ? styles.active : styles.inactive} />
                    </Tooltip>
                  </div>
                </Flex>
                <Flex vertical align="center">
                  <div className={styles.label}>{chain.name}</div>
                  <Space>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {feed ? feed : 'Random'}
                    </Typography.Title>
                  </Space>
                </Flex>
              </Flex>
            </div>
            <Flex vertical gap="middle" justify="space-between">
              <Card>
                <Typography.Title level={5}>Update time</Typography.Title>
                {new Date(diffMs).getMinutes()} min {new Date(diffMs).getSeconds()} sec
                <div className={styles.progress}>
                  <Progress
                    percent={progress}
                    showInfo={false}
                    strokeColor="#1890FF"
                    size={[230, 8]}
                  />
                </div>
              </Card>
              <Card>
                <Typography.Title level={5}>Addresses</Typography.Title>
                Address
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
                Owner
                <Flex gap={2} justify="space-between">
                  <Typography.Title level={5}>{truncateEthAddress(add0x(owner))} </Typography.Title>
                </Flex>
              </Card>
            </Flex>
            <Flex vertical gap="middle" style={{ flex: 1 }}>
              <Card
                className={styles.cardIconBg}
                style={{ backgroundImage: 'url(last_execution.png' }}
              >
                <Typography.Title level={5}>Last execution</Typography.Title>
                Timestamp
                <Typography.Title level={5}>{lastUpdateDateTime.toLocaleString()}</Typography.Title>
              </Card>
              <Card className={styles.cardIconBg} style={{ backgroundImage: 'url(interface.png' }}>
                <Typography.Title level={5}>Interface</Typography.Title>
                Method
                <Typography.Title level={5}>{method_name}</Typography.Title>
                Arguments
                <Typography.Title level={5}>
                  {subscription.method?.method_type?.Feed ? getStrMethodArgs(true) : '-'}
                </Typography.Title>
              </Card>
            </Flex>
          </Flex>
        </Flex>
        <Card style={{ flex: 1 }}>
          <Flex justify="space-between" gap="middle">
            <Typography.Title level={4} style={{ paddingBottom: '20px' }}>
              Dataset
            </Typography.Title>
            <Flex gap="middle">
              <Flex vertical>
                Executions
                <Typography.Title level={5}>{Number(executions_counter)}</Typography.Title>
              </Flex>
              <Flex vertical>
                Update time
                <Typography.Title level={5}>
                  {new Date(diffMs).getMinutes()} min {new Date(diffMs).getSeconds()} sec
                </Typography.Title>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Space>
      <Space direction="vertical" size="middle" style={{ width: '340px' }}>
        <Card className={styles.cardIconBg} style={{ backgroundImage: 'url(gas_usage.png' }}>
          <Typography.Title level={5}>Gas Usage</Typography.Title>
          Gas limit
          <Typography.Title level={5}>{gas_limit.toString()}</Typography.Title>
        </Card>
        <Card className={styles.cardIconBg} style={{ backgroundImage: 'url(data.png' }}>
          <Typography.Title level={5}>Data</Typography.Title>
          <Space direction="vertical" size="middle">
            Payload data in subscription transactions
            <Button
              type="primary"
              size="small"
              style={{ alignSelf: 'start' }}
              onClick={() => navigate(`/sybil/${id}`)}
            >
              {feed ? feed : 'Random'}
            </Button>
          </Space>
        </Card>
        <Card>
          <Typography.Title level={5}>Last execution</Typography.Title>
          Time
          <Typography.Title level={5}>{lastUpdateDateTime.toLocaleString()}</Typography.Title>
          Txhash
        </Card>
      </Space>
    </Flex>
  );
};

const Skeleton = () => {
  const { width } = useWindowDimensions();

  const isMobile = width < BREAK_POINT_MOBILE;
  return (
    <Flex gap="middle" className={styles.information} vertical={isMobile}>
      <Space direction="vertical" size="middle" style={{ flex: 1 }}>
        <Flex style={{ width: '100%' }} vertical={isMobile}>
          <Flex gap="middle" style={{ width: '100%' }} align="stretch" vertical={isMobile}>
            <Card style={{ width: isMobile ? '100%' : '268px' }}>
              <AntdSkeleton active paragraph={{ rows: 4 }} round loading />
            </Card>
            <Flex vertical gap="middle" justify="space-between">
              <Card style={{ width: isMobile ? '100%' : '270px' }}>
                <AntdSkeleton active paragraph={{ rows: 2 }} round loading />
              </Card>
              <Card>
                <AntdSkeleton active paragraph={{ rows: 2 }} round loading />
              </Card>
            </Flex>
            <Flex vertical gap="middle" style={{ flex: 1 }}>
              <Card>
                <AntdSkeleton active paragraph={{ rows: 2 }} round loading />
              </Card>
              <Card>
                <AntdSkeleton active paragraph={{ rows: 2 }} round loading />
              </Card>
            </Flex>
          </Flex>
        </Flex>
        <Card style={{ flex: 1 }}>
          <AntdSkeleton active paragraph={{ rows: 5 }} round loading />
        </Card>
      </Space>
      <Space direction="vertical" size="middle" style={{ width: '340px' }}>
        <Card>
          <AntdSkeleton active paragraph={{ rows: 3 }} round loading />
        </Card>
        <Card>
          <AntdSkeleton active paragraph={{ rows: 3 }} round loading />
        </Card>
        <Card>
          <AntdSkeleton active paragraph={{ rows: 3 }} round loading />
        </Card>
      </Space>

      {/* <Card style={{ minHeight: '60vh', width: isMobile ? '100%' : '40%', padding: '10px' }}>
        <AntdSkeleton active avatar paragraph={{ rows: 5 }} round loading />
      </Card> */}
    </Flex>
  );
};

const Empty = () => {
  return (
    <Flex>
      <Card style={{ minHeight: '60vh', width: '100%', padding: '10px' }}>
        <Typography.Title level={5}>No subscription found</Typography.Title>
      </Card>
    </Flex>
  );
};

export default Object.assign(InformationCard, { Skeleton, Empty });
