import React, { useState } from 'react';
import { Space, Card, Typography, Flex, Skeleton as AntdSkeleton, Tooltip } from 'antd';

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
import { exchangeURLS } from 'Constants/sources';
import weatherImg from 'Assets/weather.png';
import Button from 'Components/Button';

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

  const feedType =
    feed_type.Custom === null
      ? 'CustomPriceFeed'
      : feed_type.Default === null
        ? 'DefaultPriceFeed'
        : feed_type.CustomNumber === null
          ? 'CustomNumber'
          : feed_type.CustomSitrng === null
            ? 'CustomString' : '';

  const lastUpdateDate = last_update
    ? last_update
    : data && data.length && data[0].data
      ? data[0].data[feedType].timestamp
      : 0;

  const convertedFrequency = convertFrequencyDate(Number(update_freq));
  const lastUpdateDateTime = new Date(Number(lastUpdateDate) * 1000);

  const rate = data && data.length && data[0].data ? data[0].data[feedType].rate : 0;
  const lastRate =
    rate && decimals && decimals[0] ? Number(rate) / Math.pow(10, Number(decimals[0])) : 0;
  const isWeather = id.toLowerCase().includes('weather');

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
        <Flex align="center" justify="center" vertical style={{
          height: '100%',
        }}>
          {isWeather ? (
            <img
              src={weatherImg}
              alt="sun"
              style={{
                maxWidth: '35px',
              }}
            />
          ) : (
            <FeedLogos feed={id} size={76} />
          )}
        
          <Typography.Title level={4} style={{ margin: 0, textAlign: 'center' }} ellipsis={true}>
            {id}
          </Typography.Title>
        </Flex>
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
              <Typography.Text copyable>Get feed data</Typography.Text>
              <IconLink
                link={`https://${config.sybil_canister_id}.icp0.io/get_feed_data?id=${id}`}
                IconComponent={ExportOutlined}
              />
            </Space>
            <Space size="small">
              <Typography.Text copyable>Get feed data with proof</Typography.Text>
              <IconLink
                link={`https://${config.sybil_canister_id}.icp0.io/get_feed_data_with_proof?id=${id}`}
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
        <Card>
          <Typography.Title level={5}>Signature</Typography.Title>
          <Button type="primary" onClick={() => setIsVerifySignatureModalVisible(true)}>
            Verify
          </Button>
        </Card>

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
            <Flex gap={4} align="center">
              {exchangeURLS.map((exchange) => {
                return (
                  <Tooltip
                    title={<Typography.Text copyable>{exchange.url}</Typography.Text>}
                    key={exchange.name}
                  >
                    <div style={{ maxWidth: 30 }}>
                      {typeof exchange.logo === 'string' ? (
                        <img src={exchange.logo} alt={exchange.name} width={30} />
                      ) : (
                        <exchange.logo width={30} height={30} />
                      )}
                    </div>
                  </Tooltip>
                );
              })}
            </Flex>
          )}
        </Card>
      </Flex>

      {isVerifySignatureModalVisible && (
        <VerifyModal
          isVisible={isVerifySignatureModalVisible}
          setIsVisible={setIsVerifySignatureModalVisible}
          signatureAddress={data[0].signature[0]}
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
        <AntdSkeleton avatar active paragraph={{ rows: 1 }} round loading />
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
