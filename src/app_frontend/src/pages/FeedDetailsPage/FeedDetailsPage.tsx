import sybilCanister from 'Canisters/sybilCanister';
import { Feed } from 'Interfaces/feed';
import { Layout, Flex, Breadcrumb, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FeedDetails from './FeedDetails';

export const FeedDetailsPage = () => {
  const { id } = useParams();
  const [feedData, setFeedData] = useState<Feed | null>(null);
  const [isFeedLoading, setIsFeedLoading] = useState<boolean>(false);

  const fetchSubscription = async (id: string) => {
    console.log(id);
    setIsFeedLoading(true);
    try {
      const response: any = await sybilCanister.get_feed(id.replace('-', '/'));
      console.log(response);

      if (response.Err) {
        setFeedData(null);
        throw new Error(response.Err);
      } else {
        setFeedData(response[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFeedLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSubscription(id);
    }
  }, [id]);
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
        ) : feedData === null ? (
          <FeedDetails.Empty />
        ) : (
          <FeedDetails feed={feedData} />
        )}
      </Flex>
    </Layout.Content>
  );
};
