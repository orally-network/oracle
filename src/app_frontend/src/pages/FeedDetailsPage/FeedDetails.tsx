import React, { useState } from 'react';
import {
  Space,
  Card,
  Typography,
  Flex,
  Skeleton as AntdSkeleton,
  Button,
  Drawer,
  Alert,
} from 'antd';
import ConfettiExplosion, { ConfettiProps } from 'react-confetti-explosion';

import styles from './FeedDetailsPage.scss';
import { add0x, isAddressHasOx, truncateEthAddress } from 'Utils/addressUtils';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { convertFrequencyDate, getStrMethodArgs } from 'Utils/helper';
import { Feed } from 'Interfaces/feed';
import { FeedLogos } from 'Pages/Sybil/FeedCard/FeedLogos';

interface FeedDetailsProps {
  feed: Feed;
}

const mediumProps: ConfettiProps = {
  force: 0.6,
  duration: 2500,
  particleCount: 100,
  width: 1000,
  colors: ['#2F21FF', '#0089D7', '#1890FF', '#4A6293', '#fff'],
};

const FeedDetails = ({ feed }: FeedDetailsProps) => {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;

  const [isVerifySignatureModalVisible, setIsVerifySignatureModalVisible] = useState(false);
  const [isSmallExploding, setIsSmallExploding] = React.useState(false);

  const {
    id,
    decimals,
    owner,
    data,
    update_freq,
    feed_type,
    status: { last_update },
  } = feed;
  console.log(feed);

  // const chain = CHAINS_MAP[chain_id as number];

  const convertedFrequency = convertFrequencyDate(Number(update_freq));

  const lastUpdateDateTime = new Date(Number(last_update) * 1000);
  // const frequency = exec_condition[0]?.Frequency || BigInt(3600);

  // const nextUpdateDateTime = new Date(lastUpdateDateTime.getTime() + Number(frequency) * 1000);
  // const diffMs = Math.abs(+new Date() - +nextUpdateDateTime);
  // const progress = (diffMs * 100) / (Number(frequency) * 1000);

  return (
    <Flex gap="middle" vertical={isMobile} className={styles.details}>
      <Card
        style={{
          width: isMobile ? '100%' : '270px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Flex align="center" justify="center">
          <FeedLogos feed={id} size={76} />
        </Flex>
        <Typography.Title level={4} style={{ margin: 0, textAlign: 'center' }} ellipsis={true}>
          {id}
        </Typography.Title>
      </Card>

      <Flex gap="middle" vertical style={{ width: isMobile ? '100%' : '270px' }}>
        <Card>
          <Typography.Title level={5}>Price</Typography.Title>
          Last update price
        </Card>
        <Card>
          <Typography.Title level={5}>Author</Typography.Title>
          AddrAuthoress
          <Flex gap={2} justify="space-between">
            <Typography.Title level={5} copyable>
              {truncateEthAddress(add0x('trtrtr'))}
            </Typography.Title>
          </Flex>
        </Card>
      </Flex>

      <Flex gap="middle" vertical style={{ flex: 0.5 }}>
        <Card>
          <Typography.Title level={5}>Frequency</Typography.Title>
          Update frequency
          <Typography.Title level={5}>
            {convertedFrequency.value} {convertedFrequency.units}
          </Typography.Title>
        </Card>
        <Card>
          <Typography.Title level={5}>Time</Typography.Title>
          Last update time
          <Typography.Title level={5}>{lastUpdateDateTime.toLocaleString()}</Typography.Title>
        </Card>
      </Flex>

      <Flex gap="middle" vertical style={{ flex: 0.5 }}>
        <Card>
          <Typography.Title level={5}>Signature</Typography.Title>
          <Button type="primary" onClick={() => setIsVerifySignatureModalVisible(true)}>
            Verify
          </Button>
        </Card>
        <Card>
          <Typography.Title level={5}>Sources</Typography.Title>
        </Card>
      </Flex>

      {isVerifySignatureModalVisible && (
        <Drawer
          title="Verify Signature"
          placement="right"
          onClose={(e) => {
            e.stopPropagation();
            setIsVerifySignatureModalVisible(false);
          }}
          open={isVerifySignatureModalVisible}
          style={{ marginTop: '47px' }}
          width={isMobile ? '90vw' : '362px'}
        >
          <Space size="small" direction="vertical">
            <Typography.Paragraph>
              The following message was used to calculate the median price for the BTC/USD Oracle.
              You can verify its authenticity with Ethereum's ecrecover() function.
            </Typography.Paragraph>
            <Alert
              message="Note: You can edit the message to prove that any changes will invalidate the signature."
              type="warning"
              showIcon
            />
            <pre>test</pre>
            Validator Address
            <Flex gap="small">
              <Button>Done</Button>
              <Button type="primary" onClick={() => setIsSmallExploding(!isSmallExploding)}>
                Verify
                {isSmallExploding && <ConfettiExplosion {...mediumProps} zIndex={1001} />}
              </Button>
            </Flex>
          </Space>
        </Drawer>
      )}
    </Flex>
  );
};

const Skeleton = () => {
  const { width } = useWindowDimensions();

  const isMobile = width < BREAK_POINT_MOBILE;

  return (
    <Flex gap="middle" vertical={isMobile}>
      <Card
        style={{
          width: isMobile ? '100%' : '270px',
        }}
      >
        <AntdSkeleton active paragraph={{ rows: 3 }} round loading />
      </Card>

      <Flex gap="middle" style={{ flex: 1 }} vertical={isMobile}>
        <Flex gap="middle" vertical style={{ width: '270px' }}>
          <Card>
            <AntdSkeleton active paragraph={{ rows: 2 }} round loading />
          </Card>
          <Card>
            <AntdSkeleton active paragraph={{ rows: 2 }} round loading />
          </Card>
        </Flex>

        <Flex gap="middle" vertical style={{ flex: 0.5 }}>
          <Card>
            <AntdSkeleton active paragraph={{ rows: 2 }} round loading />
          </Card>
          <Card>
            <AntdSkeleton active paragraph={{ rows: 2 }} round loading />
          </Card>
        </Flex>

        <Flex gap="middle" vertical style={{ flex: 0.5 }}>
          <Card>
            <AntdSkeleton active paragraph={{ rows: 2 }} round loading />
          </Card>
          <Card>
            <AntdSkeleton active paragraph={{ rows: 2 }} round loading />
          </Card>
        </Flex>
      </Flex>
    </Flex>
  );
};

const Empty = () => {
  return (
    <Flex>
      <Card style={{ minHeight: '60vh', width: '100%', padding: '10px' }}>
        <Typography.Title level={5}>No feed found</Typography.Title>
      </Card>
    </Flex>
  );
};

export default Object.assign(FeedDetails, { Skeleton, Empty });
