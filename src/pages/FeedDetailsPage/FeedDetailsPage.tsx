import sybilCanister from 'Canisters/sybilCanister';
import { Feed } from 'Interfaces/feed';
import { Layout, Flex, Breadcrumb, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FeedDetails from './FeedDetails';
import { useGlobalState } from 'Providers/GlobalState';

export const FeedDetailsPage = () => {
  const { id } = useParams();
  const [feedData, setFeedData] = useState<Feed | null>(null);
  const [isFeedLoading, setIsFeedLoading] = useState<boolean>(false);
  const { addressData } = useGlobalState();

  const fetchFeed = async (id: string) => {
    setIsFeedLoading(true);
    try {
      // TODO: sign before the request
      const response: any = await sybilCanister.get_feed(id.replace('-', '/'), [], []);

      if (response.Err) {
        setFeedData(null);
        throw new Error(response.Err);
      } else {
        setFeedData(response.Ok[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFeedLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFeed(id);
    }
  }, [id, addressData.message, addressData.signature]);

  return (
    <Layout.Content title="Sybil">
      <Flex gap="middle" vertical>
        <Flex vertical>
          <Breadcrumb
            separator=">"
            items={[{ title: 'Sybil', href: '/sybil' }, { title: 'Details' }]}
          />
          <Typography.Title level={3}>Details</Typography.Title>
        </Flex>

        {isFeedLoading ? (
          <FeedDetails.Skeleton />
        ) : feedData === null || feedData === undefined ? (
          <FeedDetails.Empty />
        ) : (
          <FeedDetails feed={feedData} />
        )}
      </Flex>
    </Layout.Content>
  );
};
