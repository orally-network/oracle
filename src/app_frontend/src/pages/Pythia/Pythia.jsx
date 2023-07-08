import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Layout, Spin, Space } from "antd";
import { useAccount } from "wagmi";

import { remove0x } from "Utils/addressUtils";
import { useSybilPairs } from "Providers/SybilPairs";
import { usePythiaData } from "Providers/PythiaData";
import { useGlobalState } from "Providers/GlobalState";
import { useSubscriptionsFilters } from "Providers/SubscriptionsFilters";
import pythiaCanister from "Canisters/pythiaCanister";
import useSignature from "Shared/useSignature";
import logger from "Utils/logger";

import FiltersBar from "./FiltersBar";
import Subscription from "./Subscription/Subscription";
import NewSubscription from "./Subscription/NewSubscription";
import styles from "./Pythia.scss";

const Pythia = () => {
  const [isWhitelisted, setIsWhitelisted] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { subs, isSubsLoading, isChainsLoading } = usePythiaData();
  const { isLoading: isPairsLoading, pairs } = useSybilPairs();
  const {
    showAll: showAllFilter,
    showPair: showPairFilter,
    chainId: chainIdFilter,
    showInactive: showInactiveFilter,
  } = useSubscriptionsFilters();
  const { addressData } = useGlobalState();
  const { signMessage } = useSignature();
  const { address } = useAccount();

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
    async ({
      chainId,
      methodName,
      addressToCall,
      frequency,
      gasLimit,
      isRandom,
      feed,
    }) => {
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
      return subs
        .filter((sub) => (showAllFilter ? true : sub.owner === address))
        .filter((sub) =>
          showPairFilter
            ? !!sub.method?.method_type?.Random
            : !!sub.method?.method_type?.Pair
        )
        .filter((sub) =>
          chainIdFilter ? sub?.method?.chain_id === chainIdFilter : true
        )
        .filter((sub) =>
          showInactiveFilter ? true : !!sub?.status?.is_active
        );
    }
    return [];
  }, [showAllFilter, showPairFilter, showInactiveFilter, chainIdFilter]);

  return (
    <Layout.Content className={styles.pythia}>
      <Spin
        spinning={
          isChainsLoading || isSubsLoading || isSubscribing || isPairsLoading
        }
      >
        {!isWhitelisted && (
          <div className={styles.notWhitelisted}>Not whitelisted</div>
        )}
        {subs.length ? <FiltersBar /> : null}
        <Space wrap className={styles.subs}>
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

        <Space>
          <NewSubscription
            signMessage={signMessage}
            subscribe={subscribe}
            addressData={addressData}
            pairs={pairs}
          />
        </Space>
      </Spin>
    </Layout.Content>
  );
};

export default Pythia;
