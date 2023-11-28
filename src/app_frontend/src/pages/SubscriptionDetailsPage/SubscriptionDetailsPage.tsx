import { Breadcrumb, Card, Flex, Layout, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Subscription } from 'Interfaces/subscription';

import InformationCard from './InformationCard';
import { renderChart } from './DatasetChart';
import { testData } from './testData';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import pythiaCanister from 'Canisters/pythiaCanister';

export const SubscriptionDetailsPage = () => {
  const { id, chainId } = useParams();
  const [subscriptionData, setSubscriptionData] = useState<Subscription | null>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState<boolean>(false);
  const { width } = useWindowDimensions();

  const isMobile = width < BREAK_POINT_MOBILE;

  const fetchSubscription = async (id: BigInt, chainId: BigInt) => {
    setIsSubscriptionLoading(true);
    const response: any = await pythiaCanister.get_subscription(chainId, id);
    setSubscriptionData(response.Ok);
    setIsSubscriptionLoading(false);
  };

  useEffect(() => {
    if (id && chainId) {
      fetchSubscription(BigInt(id), BigInt(chainId));
    }
  }, [id, chainId]);

  // get subscription details by id from api?

  return (
    <Layout.Content title="Pythia">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space direction="vertical">
          <Breadcrumb
            separator=">"
            items={[{ title: 'Pythia', href: '/pythia' }, { title: 'Details' }]}
          />
          <Typography.Title level={3}>Pythia</Typography.Title>
        </Space>
        <Flex gap="middle" vertical={isMobile ? true : false}>
          {isSubscriptionLoading ? (
            <InformationCard.Skeleton />
          ) : subscriptionData === null ? (
            <InformationCard.Empty />
          ) : (
            <InformationCard subscription={subscriptionData} />
          )}

          <Card style={{ flex: 1 }}>
            <Typography.Title level={4} style={{ paddingBottom: '20px' }}>
              Dataset
            </Typography.Title>

            {renderChart(testData)}
          </Card>
        </Flex>
      </Space>
    </Layout.Content>
  );
};
