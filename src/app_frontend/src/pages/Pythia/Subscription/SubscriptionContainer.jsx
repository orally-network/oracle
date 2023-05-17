import React, { useCallback } from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useSignMessage } from 'wagmi';

import { setLocalStorageAddress } from 'Utils/localStorageAddress';
import { remove0x } from 'Utils/addressUtils';

import pythiaCanister from '../pythiaCanister';
import { PYTHIA_PREFIX } from '../Pythia';

import Subscription from './Subscription';
import NewSubscription from './NewSubscription';

/*
- implement NewSubscription card
- use pythia subs 
- implement subscribe
 */

const SubscriptionContainer = ({ isNew, sub, addressData, setAddressData }) => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const signMessage = useCallback(async () => {
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum to the Pythia.',
      uri: window.location.origin,
      version: '1',
      chainId: String(sub.chain_id),
    });
    const messageString = message.prepareMessage();

    const signature = await signMessageAsync({
      message: messageString,
    });

    console.log({message, messageString, signature: remove0x(signature)});

    // verify signature
    // add user and verify signature through pythia
    const res = await pythiaCanister.add_user(messageString, remove0x(signature));

    const executionAddress = res?.Ok;
    console.log({ message, messageString, signature, executionAddress });

    if (executionAddress) {
      const data = setLocalStorageAddress(address, messageString, signature, executionAddress, PYTHIA_PREFIX);

      console.log({ data });
      setAddressData(data);
    }
  }, [address, signMessageAsync, setAddressData, sub]);
  
  return isNew ? (
    <NewSubscription addressData={addressData} />
  ) : (
    <Subscription sub={sub} addressData={addressData} signMessage={signMessage} subscribe={() => {}} />
  );
};

export default SubscriptionContainer;
