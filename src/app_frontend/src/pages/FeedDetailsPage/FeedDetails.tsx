import React, { useState } from 'react';
import { Space, Card, Typography, Flex, Skeleton as AntdSkeleton, Button } from 'antd';

import styles from './FeedDetailsPage.scss';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { convertFrequencyDate } from 'Utils/helper';
import { Feed } from 'Interfaces/feed';
import { FeedLogos } from 'Pages/Sybil/FeedCard/FeedLogos';
import config from 'Constants/config';
import IconLink from 'Components/IconLink';
import { ExportOutlined } from '@ant-design/icons';
import { VerifyModal } from './VerifyModal';

interface FeedDetailsProps {
  feed: Feed;
}

const FeedDetails = ({ feed }: FeedDetailsProps) => {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;

  const [isVerifySignatureModalVisible, setIsVerifySignatureModalVisible] = useState(false);

  const {
    id,
    decimals,
    owner,
    data,
    update_freq,
    feed_type,
    status: { last_update },
    sources,
  } = feed;
  console.log(feed);

  const feedType =
    feed_type.Custom === null
      ? 'CustomPriceFeed'
      : feed_type.Default === null
        ? 'DefaultPriceFeed'
        : '';

  const convertedFrequency = convertFrequencyDate(Number(update_freq));
  const lastUpdateDateTime = new Date(Number(last_update) * 1000);

  const rate = data && data.length && data[0].data ? data[0].data[feedType].rate : 0;
  const lastRate =
    rate && decimals && decimals[0] ? Number(rate) / Math.pow(10, Number(decimals[0])) : 0;

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
          <Typography.Title level={5}>{lastRate}</Typography.Title>
        </Card>
        <Card>
          <Typography.Title level={5}>Links</Typography.Title>

          <Flex gap={2} justify="space-between" vertical>
            <Space size="small">
              <Typography.Text copyable>Get asset data</Typography.Text>
              <IconLink
                link={`https://${config.sybil_canister_id}.icp0.io/get_asset_data?id=${id}`}
                IconComponent={ExportOutlined}
              />
            </Space>
            <Space size="small">
              <Typography.Text copyable>Get asset data with proof</Typography.Text>
              <IconLink
                link={`https://${config.sybil_canister_id}.icp0.io/get_asset_data_with_proof?id=${id}`}
                IconComponent={ExportOutlined}
              />
            </Space>
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
        {data && data.length && data[0].signature?.length ? (
          <Card>
            <Typography.Title level={5}>Signature</Typography.Title>
            <Button type="primary" onClick={() => setIsVerifySignatureModalVisible(true)}>
              Verify
            </Button>
          </Card>
        ) : null}

        <Card>
          <Typography.Title level={5}>Sources</Typography.Title>
          {feed_type.Custom === null ? (
            <Space direction="vertical" size="small">
              {sources.length &&
                sources[0].length &&
                sources[0].map((source, index) => (
                  <Typography.Text key={index} copyable>
                    {source.uri}
                  </Typography.Text>
                ))}
            </Space>
          ) : (
            'icons with links to sources'
          )}
        </Card>
      </Flex>

      {isVerifySignatureModalVisible && (
        <VerifyModal
          isVisible={isVerifySignatureModalVisible}
          setIsVisible={setIsVerifySignatureModalVisible}
          signatureData={data[0].signature[0]}
          id={id}
        />
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
