import React from 'react';
import { Space, Flex, Empty } from 'antd';

import { Feed } from 'Interfaces/feed';
import { useGetSybilFeeds } from 'ApiHooks/useGetSybilFeeds';
import { RemoteDataType } from 'Interfaces/common';

import { Pagination } from 'Components/Pagination/Pagination';
import useSybilData from 'Providers/SybilPairs/useSybilFeeds';
import { DEFAULT_APOLLO_ITEMS_SIZE } from 'Constants/ui';
import { useAccount } from 'wagmi';
import { useGetApolloItems } from 'ApiHooks/useGetApolloItems';
import { useApolloData } from 'Providers/ApolloData/useApolloData';
import { ApolloInstance } from 'Interfaces/apollo';
import ApolloCard from '../ApolloCard/ApolloCard';

export const Items = () => {
  const { address } = useAccount();
  const { page, setPage } = useApolloData();
  const apolloData = useGetApolloItems({
    page,
    size: DEFAULT_APOLLO_ITEMS_SIZE,
  });

  const items: ApolloInstance[] = apolloData.data.items || [];
  const pagination = apolloData.data.meta;

  switch (apolloData.data.type) {
    case RemoteDataType.SUCCESS:
      return (
        <>
          <Space wrap size={['middle', 'middle']}>
            {items.map((item, i) => (
              <ApolloCard key={i} instance={item} />
            ))}
          </Space>
          <Pagination
            currentPage={Number(pagination?.page || 1)}
            total={Number(pagination?.totalItems)}
            setPage={setPage}
          />
        </>
      );
    case RemoteDataType.LOADING:
      return (
        <Space wrap size={['large', 'middle']}>
          {Array.from(Array(DEFAULT_APOLLO_ITEMS_SIZE).keys()).map((i) => (
            <ApolloCard.Skeleton key={i} />
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
