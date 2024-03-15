import React, { useState, useCallback } from 'react';
import { Space, Card, Typography, Flex, Drawer, Skeleton as AntdSkeleton } from 'antd';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';

import styles from './ApolloCard.scss';
import { BREAK_POINT_MOBILE } from 'Constants/ui';


import useWindowDimensions from 'Utils/useWindowDimensions';
import { Feed, FeedType } from 'Interfaces/feed';

import { BlockOutlined, EditOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { ApolloInstance } from 'Interfaces/apollo';
import { Logos } from 'Components/Logos/Logos';
import Button from 'Components/Button';
import { truncateEthAddress } from 'Utils/addressUtils';
import IconLink from 'Components/IconLink';
import { SecondaryButton } from 'Components/SecondaryButton';

type ApolloCardProps = {
  instance: ApolloInstance;
};

export const getFeedImg = ({
  feed_type,
  id,
}: {
  feed_type: FeedType;
  id: string;
  isWeather?: boolean;
}) => {
  if (feed_type && id && feed_type.hasOwnProperty('Default')) {
    return <Logos feed={id} />;
  }

  return (
    <BlockOutlined
      style={{
        fontSize: '35px',
      }}
    />
  );
};

const ApolloCard = ({ instance }: ApolloCardProps) => {
  const { address } = useAccount();
  const navigate = useNavigate();

  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  return (
    <Card
      hoverable={true}
      className={styles.item}
      title={<Typography.Title level={5}>{Number(instance.chain_id)}</Typography.Title>}
      extra={
        <Flex gap="small">
          <SecondaryButton>Add spender</SecondaryButton>
          <Button type="primary">Top up</Button>
        </Flex>
      }
    >
      <Space size="small" direction="vertical" style={{ width: '100%' }}>
        <div className={styles.header}>
          <div className={styles.info}>
            <Space>
              <Typography.Title level={4} style={{ margin: 0, maxWidth: 180 }} ellipsis={true}>
                {/* {id} */}
              </Typography.Title>
            </Space>
          </div>
        </div>

        <div className={styles.logoBg}>
          <Flex className={styles.logoWrap} align="center" justify="center">
            {/* {getFeedImg({ feed_type, id })} */}
            logos
          </Flex>
        </div>

        <Flex justify="space-between" gap={10}>
          <div className={styles.stat}>
            Address
            <br />
            <Typography.Title style={{ minWidth: '70px' }} level={5}>
              ({truncateEthAddress('')}){' '}
              <IconLink
                link={`https://arbiscan.io/address/${instance.chain_id}`}
                IconComponent={ExportOutlined}
              />
            </Typography.Title>
          </div>
          <div className={styles.stat}>
            Last data delivery <br />
            <Typography.Title level={5}>{new Date().getMinutes()} mins ago</Typography.Title>
          </div>
        </Flex>
      </Space>
    </Card>
  );
};

const Skeleton = () => {
  return (
    <Card hoverable={true} className={styles.item}>
      <AntdSkeleton active paragraph={{ rows: 3 }} round loading />
    </Card>
  );
};

export default Object.assign(ApolloCard, { Skeleton });
