import React from 'react';
import { Space, Flex, Empty } from 'antd';

import config from 'Constants/config';

import styles from './Feeds.scss';
import { Feed } from 'Interfaces/feed';
import { useGetSybilFeeds } from 'ApiHooks/useGetSybilFeeds';
import { RemoteDataType } from 'Interfaces/common';
import FeedCard from '../FeedCard/FeedCard';
import { Pagination } from 'Components/Pagination/Pagination';
import useSybilData from 'Providers/SybilPairs/useSybilFeeds';
import { DEFAULT_FEEDS } from 'Constants/ui';

const MILLI = Math.pow(10, 3);

const getCodeText = (selectedPair: Feed) => {
  const url = `http${config.isDevelopment ? '' : 's'}://${config.sybil_canister_id}.${
    config.DOMAIN
  }/get_asset_data_with_proof?pair_id=${selectedPair?.id ?? '{pair_id}'}`;

  return ` // fetch price feed
  const url = '${url}';
  const response = await fetch(url);

  // response example:
  {
    "symbol": "${selectedPair?.id ?? 'string'}",
    "rate": ${selectedPair?.data?.[0]?.rate ?? 'number'},
    "timestamp": ${selectedPair?.data?.[0]?.timestamp ?? 'number'}, // ${new Date(
      Number(selectedPair?.data?.[0]?.timestamp) * MILLI
    ).toGMTString()}
    "decimals": ${selectedPair?.data?.[0]?.decimals ?? 'number'}
    "signature": "${selectedPair?.data?.[0]?.signature ?? 'string'}"
  }
  `;
};

export const Feeds = () => {
  const { page, setPage } = useSybilData();
  const feedsData = useGetSybilFeeds({ page });

  const feeds: Feed[] = feedsData.data.items || [];
  const pagination = feedsData.data.meta;

  switch (feedsData.data.type) {
    case RemoteDataType.SUCCESS:
      return (
        <>
          <Space wrap className={styles.subs} size={['large', 'middle']}>
            {feeds.map((feed, i) => (
              <FeedCard key={i} feed={feed} />
            ))}
          </Space>
          {/* TODO: add when BE pagination is ready */}
          {/* <Pagination
            currentPage={Number(pagination?.page || 1)}
            total={Number(pagination?.totalItems)}
            setPage={setPage}
          /> */}
        </>
      );
    case RemoteDataType.LOADING:
      return (
        <Space wrap className={styles.subs} size={['large', 'middle']}>
          {Array.from(Array(DEFAULT_FEEDS).keys()).map((i) => (
            <FeedCard.Skeleton key={i} />
          ))}
        </Space>
      );
    case RemoteDataType.EMPTY:
      return (
        <Flex justify="center" align="center" style={{ height: '60vh' }}>
          <Empty />
        </Flex>
      );
    default:
      return null;
  }
};
