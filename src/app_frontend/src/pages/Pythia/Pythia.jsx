import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Flex, Layout, Drawer, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';
import Button from 'Components/Button';

import { remove0x } from 'Utils/addressUtils';
import Loader from 'Components/Loader';
import { useSybilPairs } from 'Providers/SybilPairs';
import { usePythiaData } from 'Providers/PythiaData';
import { useGlobalState } from 'Providers/GlobalState';
import { useSubscriptionsFilters } from 'Providers/SubscriptionsFilters';
import pythiaCanister from 'Canisters/pythiaCanister';
import useSignature from 'Shared/useSignature';
import logger from 'Utils/logger';

import FiltersBar from './FiltersBar';
import Subscription from './Subscription/Subscription';
import NewSubscription from './Subscription/NewSubscription';
import styles from './Pythia.scss';

const Pythia = () => {
  const [isWhitelisted, setIsWhitelisted] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isNewSubscriptionModalVisible, setIsNewSubscriptionModalVisible] = useState(false);
  const { subs, isSubsLoading, isChainsLoading } = usePythiaData();
  const { isLoading: isPairsLoading, pairs } = useSybilPairs();

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
      // chain_id : nat;
      // pair_id : opt text;
      // contract_addr : text;
      // method_abi : text;
      // frequency : nat;
      // is_random : bool;
      // gas_limit : nat;
      // msg : text;
      // sig : text;

      setIsSubscribing(true);

      const res = await pythiaCanister.subscribe({
        chain_id: chainId,
        pair_id: feed ? [feed] : [],
        contract_addr: remove0x(addressToCall),
        method_abi: methodName,
        frequency: frequency,
        // frequency_condition: [frequency],
        // price_mutation_cond_req: [],
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

  return (
    <Layout.Content className={styles.pythia} title="Pythia">
      {isChainsLoading || isSubsLoading || isSubscribing || isPairsLoading ? (
        <Loader size="large" isFullPage />
      ) : (
        <>
          <Space size="large" direction="vertical" style={{ width: '100%' }}>
            {!isWhitelisted && <div className={styles.notWhitelisted}>Not whitelisted</div>}
            <Flex align="center" justify="space-between">
              <div className={styles.title}>
                <Typography.Title level={3}>Pythia</Typography.Title>
              </div>

              {subs.length ? <FiltersBar /> : null}

              <Button
                type="primary"
                size="large"
                onClick={() => setIsNewSubscriptionModalVisible(!isNewSubscriptionModalVisible)}
                icon={<PlusOutlined />}
              >
                Create subscription
              </Button>
            </Flex>

            <Space wrap className={styles.subs} size="middle">
              {filteredSubs.map((sub, i) => (
                <Subscription
                  key={i}
                  sub={sub}
                  addressData={addressData}
                  signMessage={signMessage}
                  startSubscription={startSubscription}
                  stopSubscription={stopSubscription}
                  withdraw={withdraw}
                />
              ))}
            </Space>

            {isNewSubscriptionModalVisible && (
              <Drawer
                title="Create Subscription"
                placement="right"
                onClose={() => setIsNewSubscriptionModalVisible(false)}
                open={isNewSubscriptionModalVisible}
                style={{ paddingTop: '80px' }}
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
        </>
      )}
    </Layout.Content>
  );
};

export default Pythia;
