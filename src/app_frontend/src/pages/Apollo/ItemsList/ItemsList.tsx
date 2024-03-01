import React from 'react';
import { Space, Flex, Empty } from 'antd';

import styles from './Feeds.scss';
import { Feed } from 'Interfaces/feed';
import { useGetSybilFeeds } from 'ApiHooks/useGetSybilFeeds';
import { RemoteDataType } from 'Interfaces/common';
import FeedCard from '../FeedCard/FeedCard';
import { Pagination } from 'Components/Pagination/Pagination';
import useSybilData from 'Providers/SybilPairs/useSybilFeeds';
import { DEFAULT_APOLLO_ITEMS_SIZE } from 'Constants/ui';
import { useAccount } from 'wagmi';
import { useGetApolloItems } from 'ApiHooks/useGetApolloItems';
import { useApolloData } from 'Providers/ApolloData/useApolloData';

export const Items = () => {
  const { address } = useAccount();
  const { page } = useApolloData();
  const data = useGetApolloItems({
    page,
    size: DEFAULT_APOLLO_ITEMS_SIZE,
  });

  console.log('data', data);

  // const feeds: Feed[] = feedsData.data.items || [];
  // const pagination = feedsData.data.meta;

  // switch (feedsData.data.type) {
  //   case RemoteDataType.SUCCESS:
  //     return (
  //       <>
  //         <Space wrap className={styles.subs} size={['middle', 'middle']}>
  //           {feeds.map((feed, i) => (
  //             <FeedCard key={i} feed={feed} />
  //           ))}
  //         </Space>
  //         <Pagination
  //           currentPage={Number(pagination?.page || 1)}
  //           total={Number(pagination?.totalItems)}
  //           setPage={setPage}
  //         />
  //       </>
  //     );
  //   case RemoteDataType.LOADING:
  //     return (
  //       <Space wrap className={styles.subs} size={['large', 'middle']}>
  //         {Array.from(Array(DEFAULT_FEEDS_SIZE).keys()).map((i) => (
  //           <FeedCard.Skeleton key={i} />
  //         ))}
  //       </Space>
  //     );
  //   case RemoteDataType.EMPTY:
  //     return (
  //       <Flex justify="center" align="center" style={{ height: '60vh' }}>
  //         <Empty />
  //       </Flex>
  //     );
  //   default:
  //     return null;
  // }

  return <div>test</div>;
};
