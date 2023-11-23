import { Breadcrumb, Card, Flex, Layout, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePythiaData } from 'Providers/PythiaData';
import { Subscription } from 'Interfaces/subscription';

import InformationCard from './InformationCard';
import { renderChart } from './DatasetChart';
import { testData } from './testData';

export const SubscriptionDetailsPage = () => {
  const { id } = useParams();
  const { subs, isSubsLoading, isChainsLoading } = usePythiaData();
  const [subscriptionData, setSubscriptionData] = useState<Subscription | null>(null);

  useEffect(() => {
    if (subs.length && id) {
      setSubscriptionData(subs.find((s) => s.id === BigInt(id)) ?? null);
    }
  }, [subs, id]);

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
        <Flex gap="middle">
          {isChainsLoading || isSubsLoading ? (
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
