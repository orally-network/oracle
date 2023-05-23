import React, { useEffect, useState, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { Layout, Spin } from 'antd';

import { getLocalStorageAddress, setLocalStorageAddress } from 'Utils/localStorageAddress';
import { remove0x } from 'Utils/addressUtils';
import { useSybilPairs } from 'Providers/SybilPairs';

import pythiaCanister from './pythiaCanister';
import Subscription from './Subscription/Subscription';
import NewSubscription from './Subscription/NewSubscription';
import styles from './Pythia.scss';

export const PYTHIA_PREFIX = 'pythia-';

const Pythia = () => {
  const [subs, setSubs] = useState([]);
  const [isSubsLoading, setIsSubsLoading] = useState(false);
  const [chains, setChains] = useState([]);
  const [isChainsLoading, setIsChainsLoading] = useState(false);
  const [addressData, setAddressData] = useState();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const { isLoading: isPairsLoading, pairs } = useSybilPairs();

  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const fetchSubs = useCallback(async () => {
    if (address) {
      setIsSubsLoading(true);
      
      const subs = await pythiaCanister.get_subs(address);
      console.log({subs})
      
      setIsSubsLoading(false);
      if (subs.Ok) setSubs(subs.Ok);
    }
  }, [address]);
  
  const fetchChains = useCallback(async () => {
    setIsChainsLoading(true);
    
    const chains = await pythiaCanister.get_chains();
    console.log({chains});
    
    setIsChainsLoading(false);
    if (chains.Ok) setChains(chains.Ok);
  }, []);

  useEffect(() => {
    fetchSubs();
    fetchChains();
  }, [address]);

  useEffect(() => {
    if (address) {
      setAddressData(getLocalStorageAddress(address, PYTHIA_PREFIX));
    }
  }, [address]);

  const signMessage = useCallback(async (chainId) => {
    setIsSigningMessage(true);
    
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

    setIsSigningMessage(false);
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
  
  return (
    <Spin spinning={isChainsLoading || isSubsLoading || isSubscribing || isSigningMessage || isPairsLoading}>
      <Layout.Content className={styles.pythia}>
        {subs.map((sub, i) => <Subscription key={i} sub={sub} addressData={addressData} signMessage={signMessage} />)}
  
        <NewSubscription signMessage={signMessage} subscribe={subscribe} addressData={addressData} chains={chains} fetchSubs={fetchSubs} pairs={pairs} />
      </Layout.Content>
    </Spin>
  );
};

export default Pythia;
