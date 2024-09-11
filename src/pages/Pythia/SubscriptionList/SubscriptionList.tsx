import React from 'react';
import { Empty, Flex, Space } from 'antd';
import SubscriptionCard from '../Subscription/SubscriptionCard';
import { useGlobalState } from 'Providers/GlobalState';
import { DEFAULT_SUBSCRIPTIONS } from 'Constants/ui';
import { useGetSubscriptions } from 'ApiHooks/useGetSubscriptions';
import { GeneralResponse, RemoteDataType } from 'Interfaces/common';
import { Pagination } from 'Components/Pagination/Pagination';

import styles from '../Pythia.module.scss';
import { usePythiaData } from 'Providers/PythiaData';
import { useAccount } from 'wagmi';

interface SubscriptionListProps {
  startSubscription: (chainId: bigint, subId: bigint) => Promise<GeneralResponse>;
  stopSubscription: (chainId: bigint, subId: bigint) => Promise<GeneralResponse>;
  withdraw: (chainId: bigint, subId: bigint) => Promise<GeneralResponse>;
}

export const SubscriptionList = ({
  startSubscription,
  stopSubscription,
  withdraw,
}: SubscriptionListProps) => {
  const { addressData } = useGlobalState();
  const { address } = useAccount();
  const { showInactive, searchQuery, chainIds, showMine, filterByType, page, setPage } =
    usePythiaData();

  const subscriptionsData = useGetSubscriptions({
    page,
    size: DEFAULT_SUBSCRIPTIONS,
    filters: {
      is_active: showInactive === true ? [] : [true],
      chain_ids: chainIds,
      owner: showMine && address ? [address] : [],
      search: searchQuery ? [searchQuery] : [],
      method_type: filterByType !== 'Empty' ? [{ [filterByType]: '' }] : [],
    },
  });

  const subscriptions = subscriptionsData.data.items || [];
  const pagination = subscriptionsData.data.meta;

  switch (subscriptionsData.data.type) {
    case RemoteDataType.SUCCESS:
      return (
        <>
          <Flex wrap="wrap" className={styles.subs} gap="middle">
            {subscriptions.map((sub, i) => (
              <SubscriptionCard
                key={i}
                sub={sub}
                addressData={addressData}
                startSubscription={startSubscription}
                stopSubscription={stopSubscription}
                withdraw={withdraw}
              />
            ))}
          </Flex>

          <Pagination
            currentPage={Number(pagination?.page || 1)}
            total={Number(pagination?.totalItems)}
            setPage={setPage}
            pageSize={DEFAULT_SUBSCRIPTIONS}
          />
        </>
      );
    case RemoteDataType.LOADING:
      return (
        <Space wrap className={styles.subs} size={['large', 'middle']}>
          {Array.from(Array(DEFAULT_SUBSCRIPTIONS).keys()).map((i) => (
            <SubscriptionCard.Skeleton key={i} />
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
