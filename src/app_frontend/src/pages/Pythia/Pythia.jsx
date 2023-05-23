import React, { useEffect, useState, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { Layout, Spin, Space } from 'antd';

import { getLocalStorageAddress, setLocalStorageAddress } from 'Utils/localStorageAddress';
import { remove0x } from 'Utils/addressUtils';
import { useSybilPairs } from 'Providers/SybilPairs';
import { usePythiaData } from 'Providers/PythiaData';

import pythiaCanister from 'Canisters/pythiaCanister';
import Subscription from './Subscription/Subscription';
import NewSubscription from './Subscription/NewSubscription';
import styles from './Pythia.scss';

export const PYTHIA_PREFIX = 'pythia-';

const Pythia = () => {
  const [addressData, setAddressData] = useState();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { subs, chains, isSubsLoading, isChainsLoading } = usePythiaData();
  const { isLoading: isPairsLoading, pairs } = useSybilPairs();

  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    if (address) {
      setAddressData(getLocalStorageAddress(address, PYTHIA_PREFIX));
    }
  }, [address]);

  const signMessage = useCallback(async (chainId) => {
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum to the Pythia.',
      uri: window.location.origin,
      version: '1',
      chainId: String(chainId),
    });
    const messageString = message.prepareMessage();

    const signature = await signMessageAsync({
      message: messageString,
    });

    console.log({message, messageString, signature: remove0x(signature)});

    // verify signature
    // add user and verify signature through pythia
    const res = await pythiaCanister.add_user(messageString, remove0x(signature));

    if (res.Err) {
      throw new Error(res.Err);
    }

    const executionAddress = res?.Ok;
    console.log({ message, messageString, signature, executionAddress, res });

    if (executionAddress) {
      const data = setLocalStorageAddress(address, messageString, signature, executionAddress, PYTHIA_PREFIX);

      console.log({ data });
      setAddressData(data);
    }
  }, [address, signMessageAsync, setAddressData, chains]);

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
