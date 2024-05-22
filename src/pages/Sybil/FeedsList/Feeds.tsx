import React from 'react';
import { Space, Flex, Empty } from 'antd';

import styles from './Feeds.module.scss';
import { Feed } from 'Interfaces/feed';
import { useGetSybilFeeds } from 'ApiHooks/useGetSybilFeeds';
import { RemoteDataType } from 'Interfaces/common';
import FeedCard from '../FeedCard/FeedCard';
import { Pagination } from 'Components/Pagination/Pagination';
import useSybilData from 'Providers/SybilPairs/useSybilFeeds';
import { DEFAULT_FEEDS_SIZE } from 'Constants/ui';
import { useAccount } from 'wagmi';

export const Feeds = () => {
  const { page, showMine, searchQuery, feedType, setPage } = useSybilData();
  const { address } = useAccount();
  const feedsData = useGetSybilFeeds({
    page,
    size: DEFAULT_FEEDS_SIZE,
    filters: {
      owner: showMine && address ? [address] : [],
      search: searchQuery ? [searchQuery] : [],
      feed_type: feedType !== 'All' ? [{ [feedType]: null }] : [],
    },
  });

  const feeds: Feed[] = feedsData.data.items || [];
  const pagination = feedsData.data.meta;

  switch (feedsData.data.type) {
    case RemoteDataType.SUCCESS:
      return (
        <>
          <Flex wrap="wrap" className={styles.container} gap="middle">
            {feeds.map((feed, i) => (
              <FeedCard key={i} feed={feed} />
            ))}
          </Flex>
          <Pagination
            currentPage={Number(pagination?.page || 1)}
            pageSize={DEFAULT_FEEDS_SIZE}
            total={Number(pagination?.totalItems)}
            setPage={setPage}
          />
        </>
      );
    case RemoteDataType.LOADING:
      return (
        <Space wrap className={styles.container} size={['large', 'middle']}>
          {Array.from(Array(DEFAULT_FEEDS_SIZE).keys()).map((i) => (
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
