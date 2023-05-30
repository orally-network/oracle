import React, { useState, useCallback } from 'react';
import { Layout, Spin, Space } from 'antd';
import { useAccount } from 'wagmi';

import { remove0x } from 'Utils/addressUtils';
import { useSybilPairs } from 'Providers/SybilPairs';
import { usePythiaData } from 'Providers/PythiaData';
import { useGlobalState } from 'Providers/GlobalState';
import pythiaCanister from 'Canisters/pythiaCanister';
import useSignature from 'Shared/useSignature';

import Subscription from './Subscription/Subscription';
import NewSubscription from './Subscription/NewSubscription';
import styles from './Pythia.scss';

const Pythia = () => {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { subs, chains, isSubsLoading, isChainsLoading } = usePythiaData();
  const { isLoading: isPairsLoading, pairs } = useSybilPairs();
  const { addressData } = useGlobalState();

  const { signMessage } = useSignature();
  const { address } = useAccount();

  const subscribe = useCallback(async ({
                                         chainId,
                                         methodName,
                                         addressToCall,
                                         frequency,
                                         isRandom,
                                         feed,
                                       }) => {
    // chain_id: Nat,
    //   pair_id: Option<String>,
    //   contract_addr: String,
    //   method_abi: String,
    //   frequency: Nat,
    //   is_random: bool,
    //   msg: String,
    //   sig: String,

    setIsSubscribing(true);

    const res = await pythiaCanister.subscribe(chainId, feed ? [feed] : [], remove0x(addressToCall), methodName, frequency, isRandom, addressData.message, remove0x(addressData.signature));

    setIsSubscribing(false);
    console.log({ res });

    if (res.Err) {
      throw new Error(res.Err);
    }

    return res;
  }, [addressData]);
  
  const stopSubscription = useCallback(async (subId) => {
    const res = await pythiaCanister.stop_sub(subId, addressData.message, remove0x(addressData.signature));
    console.log({ res });
    
    if (res.Err) {
      throw new Error(res.Err);
    }
    
    return res;
  }, [addressData]);
  
  const startSubscription = useCallback(async (subId) => {
    const res = await pythiaCanister.start_sub(subId, addressData.message, remove0x(addressData.signature));
    console.log({ res });
    
    if (res.Err) {
      throw new Error(res.Err);
    }
    
    return res;
  }, [addressData]);
  
  const withdraw = useCallback(async (chainId) => {
    const res = await pythiaCanister.withdraw(chainId, addressData.message, remove0x(addressData.signature), address);
    console.log({ res });
    
    if (res.Err) {
      throw new Error(res.Err);
    }
    
    return res;
  }, [addressData, address]);
  
  return (
    <Spin spinning={isChainsLoading || isSubsLoading || isSubscribing || isPairsLoading}>
      <Layout.Content className={styles.pythia}>
        <Space wrap className={styles.subs}>
          {subs.map((sub, i) => <Subscription
            key={i}
            sub={sub}
            addressData={addressData}
            signMessage={signMessage}
            startSubscription={startSubscription}
            stopSubscription={stopSubscription}
            withdraw={withdraw}
          />)}
        </Space>
  
        <Space>
          <NewSubscription signMessage={signMessage} subscribe={subscribe} addressData={addressData} chains={chains} pairs={pairs} />
        </Space>
      </Layout.Content>
    </Spin>
  );
};

export default Pythia;
