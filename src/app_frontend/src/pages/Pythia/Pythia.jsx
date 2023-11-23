import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Flex, Layout, Drawer, Space, Typography, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';
import Button from 'Components/Button';

import { remove0x } from 'Utils/addressUtils';
import { useSybilPairs } from 'Providers/SybilPairs';
import { usePythiaData } from 'Providers/PythiaData';
import { useGlobalState } from 'Providers/GlobalState';
import { useSubscriptionsFilters } from 'Providers/SubscriptionsFilters';
import pythiaCanister from 'Canisters/pythiaCanister';
import useSignature from 'Shared/useSignature';
import logger from 'Utils/logger';
import { DEFAULT_SUBSCRIPTIONS } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';

import FiltersBar from './FiltersBar';
import SubscriptionCard from './Subscription/SubscriptionCard';
import NewSubscription from './Subscription/NewSubscription';
import styles from './Pythia.scss';

const Pythia = () => {
  const [isWhitelisted, setIsWhitelisted] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isNewSubscriptionModalVisible, setIsNewSubscriptionModalVisible] = useState(false);
  const { subs, isSubsLoading, isChainsLoading } = usePythiaData();
  const { isLoading: isPairsLoading, pairs } = useSybilPairs();

  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const [searchParams] = useSearchParams();

  const {
    showMine,
    chainIds: chainIdsFilter,
    searchQuery,
    filterByType,
    setFilterByType,
    setShowMine,
  } = useSubscriptionsFilters();
  const { addressData } = useGlobalState();
  const { signMessage } = useSignature();
  const { address } = useAccount();

  useEffect(() => {
    const typeFilter = searchParams.get('type');
    const authorFilter = searchParams.get('showMine');
    setFilterByType(typeFilter);
    setShowMine(authorFilter === 'true' ? true : false);
  }, [searchParams, setFilterByType, setShowMine]);

  useEffect(() => {
    const checkWhitelisted = async () => {
      if (address) {
        const res = await pythiaCanister.is_whitelisted(remove0x(address));

        console.log({ res });

        if (res.Err) {
          throw new Error(res.Err);
        }

        setIsWhitelisted(res.Ok);
      }
    };

    checkWhitelisted();
  }, [address]);

  const subscribe = useCallback(
    async ({ chainId, methodName, addressToCall, frequency, gasLimit, isRandom, feed }) => {
      setIsSubscribing(true);

      const res = await pythiaCanister.subscribe({
        chain_id: chainId,
        pair_id: feed ? [feed] : [],
        contract_addr: remove0x(addressToCall),
        method_abi: methodName,
        frequency: frequency,
        is_random: isRandom,
        gas_limit: Number(gasLimit),
        msg: addressData.message,
        sig: remove0x(addressData.signature),
      });

      setIsSubscribing(false);
      console.log({ res });

      if (res.Err) {
        logger.error(`Failed to subscribe to ${addressToCall}, ${res.Err}`);

        throw new Error(res.Err);
      }

      return res;
    },
    [addressData]
  );

  const stopSubscription = useCallback(
    async (chainId, subId) => {
      const res = await pythiaCanister.stop_subscription(
        chainId,
        subId,
        addressData.message,
        remove0x(addressData.signature)
      );
      console.log({ res });

      if (res.Err) {
        throw new Error(res.Err);
      }

      return res;
    },
    [addressData]
  );

  const startSubscription = useCallback(
    async (chainId, subId) => {
      const res = await pythiaCanister.start_subscription(
        chainId,
        subId,
        addressData.message,
        remove0x(addressData.signature)
      );
      console.log({ res });

      if (res.Err) {
        throw new Error(res.Err);
      }

      return res;
    },
    [addressData]
  );

  const withdraw = useCallback(
    async (chainId) => {
      const res = await pythiaCanister.withdraw(
        chainId,
        addressData.message,
        remove0x(addressData.signature),
        address
      );
      console.log({ res });

      if (res.Err) {
        throw new Error(res.Err);
      }

      return res;
    },
    [addressData, address]
  );

  const filteredSubs = useMemo(() => {
    if (subs.length) {
      return (
        subs
          .filter((sub) => (showMine ? sub.owner === address?.toLowerCase?.() : true))
          .filter((sub) => (filterByType === 'price' ? sub.method?.method_type?.Pair : true))
          .filter((sub) => (filterByType === 'random' ? sub.method?.method_type?.Random : true))
          .filter((sub) =>
            chainIdsFilter.length > 0 ? chainIdsFilter.includes(sub?.method?.chain_id) : true
          )
          //add later search by name, chain and pair
          .filter((sub) =>
            searchQuery ? sub.method?.method_type?.Pair?.toLowerCase().includes(searchQuery) : true
          )
      );
    }
    return [];
  }, [showMine, filterByType, subs, address, chainIdsFilter, searchQuery]);

  console.log({ filteredSubs });

  const loading = isChainsLoading || isSubsLoading || isSubscribing || isPairsLoading;

  return (
    <Layout.Content className={styles.pythia} title="Pythia">
      <Flex vertical align="center" wrap="wrap">
        <Space size="large" direction="vertical" style={{ width: '100%' }}>
          {!isWhitelisted && <div className={styles.notWhitelisted}>Not whitelisted</div>}
          <Flex align="center" justify="space-between">
            <div className={styles.title}>
              <Typography.Title level={3}>Pythia</Typography.Title>
            </div>

            {subs.length ? <FiltersBar /> : <Skeleton paragraph length={200} />}

            {loading ? (
              <Skeleton.Button active loading round size="large" />
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={() => setIsNewSubscriptionModalVisible(!isNewSubscriptionModalVisible)}
                icon={<PlusOutlined />}
                style={{ width: isMobile ? '40px' : 'auto', height: isMobile ? '40px' : 'auto' }}
              >
                {isMobile ? '' : 'Create subscription'}
              </Button>
            )}
          </Flex>

          <Space wrap className={styles.subs} size="middle">
            {loading ? (
              <>
                {Array.from(Array(DEFAULT_SUBSCRIPTIONS).keys()).map((sub, i) => (
                  <SubscriptionCard.Skeleton key={i} />
                ))}
              </>
            ) : (
              filteredSubs.map((sub, i) => (
                <SubscriptionCard
                  key={i}
                  sub={sub}
                  addressData={addressData}
                  signMessage={signMessage}
                  startSubscription={startSubscription}
                  stopSubscription={stopSubscription}
                  withdraw={withdraw}
                />
              ))
            )}
          </Space>

          {isNewSubscriptionModalVisible && (
            <Drawer
              title="Create Subscription"
              placement="right"
              onClose={() => setIsNewSubscriptionModalVisible(false)}
              open={isNewSubscriptionModalVisible}
              style={{ paddingTop: '80px' }}
              width={isMobile ? '90vw' : '54vw'}
            >
              <NewSubscription
                signMessage={signMessage}
                subscribe={subscribe}
                addressData={addressData}
                pairs={pairs}
              />
            </Drawer>
          )}
        </Space>
      </Flex>
    </Layout.Content>
  );
};

export default Pythia;
