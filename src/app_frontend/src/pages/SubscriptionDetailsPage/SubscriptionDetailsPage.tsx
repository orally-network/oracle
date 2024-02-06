import { Breadcrumb, Flex, Layout, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Subscription } from 'Interfaces/subscription';

import InformationCard from './InformationCard';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import pythiaCanister from 'Canisters/pythiaCanister';

export const SubscriptionDetailsPage = () => {
  const { id, chainId } = useParams();
  const [subscriptionData, setSubscriptionData] = useState<Subscription | null>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState<boolean>(false);

  const fetchSubscription = async (id: BigInt, chainId: BigInt) => {
    setIsSubscriptionLoading(true);
    try {
      const response: any = await pythiaCanister.get_subscription(chainId, id);

      if (response.Err) {
        setSubscriptionData(null);
        throw new Error(response.Err);
      } else {
        setSubscriptionData(response.Ok);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    if (id && chainId) {
      fetchSubscription(BigInt(id), BigInt(chainId));
    }
  }, [id, chainId]);

  return (
    <Layout.Content title="Pythia">
      <Flex gap="middle" vertical>
        <Flex vertical>
          <Breadcrumb
            separator=">"
            items={[{ title: 'Pythia', href: '/pythia' }, { title: 'Details' }]}
          />
          <Typography.Title level={3}>Details</Typography.Title>
        </Flex>
        {isSubscriptionLoading ? (
          <InformationCard.Skeleton />
        ) : subscriptionData === null ? (
          <InformationCard.Empty />
        ) : (
          <InformationCard subscription={subscriptionData} />
        )}
      </Flex>
    </Layout.Content>
  );
};
