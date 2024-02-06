import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Flex, Layout, Drawer, Space, Typography } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';
import Button from 'Components/Button';

import { remove0x } from 'Utils/addressUtils';
import { usePythiaData } from 'Providers/PythiaData';
import { useGlobalState } from 'Providers/GlobalState';
import pythiaCanister from 'Canisters/pythiaCanister';
import logger from 'Utils/logger';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';

import FiltersBar from './FiltersBar';
import NewSubscription from './Subscription/NewSubscription';
import styles from './Pythia.scss';
import { GeneralResponse } from 'Interfaces/common';

import { FilterType } from 'Interfaces/subscription';
import { SubscriptionList } from './SubscriptionList/SubscriptionList';

const Pythia = () => {
  const [isWhitelisted, setIsWhitelisted] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isNewSubscriptionModalVisible, setIsNewSubscriptionModalVisible] = useState(false);
  const { setFilterByType, setShowMine, setShowInactive } = usePythiaData();
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const [searchParams] = useSearchParams();

  const { address } = useAccount();
  const { addressData } = useGlobalState();

  useEffect(() => {
    const typeFilter = searchParams.get('type');
    const authorFilter = searchParams.get('showMine');
    const inactiveFilter = searchParams.get('showInactive');
    if (typeFilter !== null) {
      setFilterByType(typeFilter as FilterType);
    }
    setShowMine(authorFilter === 'true' ? true : false);
    setShowInactive(inactiveFilter === 'true' ? true : false);
  }, [searchParams, setFilterByType, setShowMine, setShowInactive]);

  useEffect(() => {
    const checkWhitelisted = async () => {
      if (address) {
        const res: GeneralResponse = await pythiaCanister.is_whitelisted(remove0x(address));

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
    async ({
      label,
      chainId,
      methodName,
      addressToCall,
      frequency,
      gasLimit,
      isRandom,
      feed,
    }: {
      label: string;
      chainId: BigInt;
      methodName: string;
      addressToCall: string;
      frequency: BigInt;
      gasLimit: number;
      isRandom: boolean;
      feed: string;
    }) => {
      setIsSubscribing(true);

      const payload = {
        label,
        chain_id: chainId,
        feed_id: feed ? [feed] : [],
        contract_addr: remove0x(addressToCall),
        method_abi: methodName,
        frequency_condition: [frequency],
        is_random: isRandom,
        gas_limit: BigInt(gasLimit),
        msg: addressData.message,
        sig: remove0x(addressData.signature),
        price_mutation_condition: [],
      };

      const res: GeneralResponse = await pythiaCanister.subscribe(payload);

      setIsSubscribing(false);
      console.log({ res });

      if (res.Err) {
        logger.error(`Failed to subscribe to ${addressToCall}, ${res.Err}`);

        throw new Error(res.Err);
      }

      setIsNewSubscriptionModalVisible(false);

      return res;
    },
    [addressData]
  );

  const stopSubscription = useCallback(
    async (chainId: BigInt, subId: BigInt) => {
      const res: GeneralResponse = await pythiaCanister.stop_subscription(
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
    async (chainId: BigInt, subId: BigInt) => {
      const res: GeneralResponse = await pythiaCanister.start_subscription(
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
    async (chainId: BigInt) => {
      const res: GeneralResponse = await pythiaCanister.withdraw(
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

  return (
    <Layout.Content className={styles.pythia} title="Pythia">
      <Flex vertical align="center" wrap="wrap">
        <Space size="middle" direction="vertical" style={{ width: '100%', position: 'relative' }}>
          {!isWhitelisted && <div className={styles.notWhitelisted}>Not whitelisted</div>}
          <Flex align="center" justify="space-between" gap={8}>
            <Typography.Title style={{ minWidth: '70px' }} level={3}>
              Pythia
            </Typography.Title>

            <FiltersBar />
            <Button
              type="primary"
              size="large"
              onClick={() => setIsNewSubscriptionModalVisible(!isNewSubscriptionModalVisible)}
              icon={<PlusCircleOutlined />}
              style={{ width: isMobile ? '40px' : 'auto', height: isMobile ? '40px' : 'auto' }}
            >
              {isMobile ? '' : 'Create subscription'}
            </Button>
          </Flex>

          <SubscriptionList
            startSubscription={startSubscription}
            stopSubscription={stopSubscription}
            withdraw={withdraw}
          />

          {isNewSubscriptionModalVisible && (
            <Drawer
              title="Create Subscription"
              placement="right"
              onClose={() => setIsNewSubscriptionModalVisible(false)}
              open={isNewSubscriptionModalVisible}
              style={{ marginTop: '47px' }}
              width={isMobile ? '90vw' : '362px'}
            >
              <NewSubscription subscribe={subscribe} addressData={addressData} />
            </Drawer>
          )}
        </Space>
      </Flex>
    </Layout.Content>
  );
};

export default Pythia;
