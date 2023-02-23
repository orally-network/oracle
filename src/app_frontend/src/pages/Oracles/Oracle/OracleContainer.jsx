import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';

import { createActor as createOracleActor } from 'Declarations/oracle';
import { CHAINS_MAP } from 'Constants/chains';
import { remove0x } from 'Utils/addressUtils';

import Oracle from './Oracle';
import { setLocalStorageAddress } from 'Utils/localStorageAddress';

const OracleContainer = ({ oracleId, addressData, setAddressData }) => {
  const [state, setState] = useState();

  const oracle = useMemo(() => createOracleActor(oracleId), [oracleId]);

  const { address } = useAccount();
  const { chain: currentChain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const signMessage = useCallback(async () => {
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum to the oracle.',
      uri: window.location.origin,
      version: '1',
      chainId: currentChain?.id,
    });
    const messageString = message.prepareMessage();

    const signature = await signMessageAsync({
      message: messageString,
    });

    // verify signature
    const res = await oracle.verify_address(messageString, remove0x(signature));

    console.log({ res, message, messageString, signature, oracle });

    const [signedAddress, executionAddress] = res?.Ok ?? [];

    if (signedAddress && executionAddress) {
      const data = setLocalStorageAddress(signedAddress, messageString, signature, executionAddress);

      setAddressData(data);
    }
  }, [address, oracle, currentChain, signMessageAsync, setAddressData]);

  useEffect(() => {
    const fetch = async () => {
      const state = await oracle.get_state();

      setState({
        ...state,
        chain: CHAINS_MAP[state.chain_id],
      });
    };

    if (oracle) {
      fetch();
    }
  }, [oracle]);

  const isLoading = !state?.fetcher;

  return !isLoading && (
    <Oracle
      oracleId={oracleId}
      addressData={addressData}
      signMessage={signMessage}
      state={state}
      oracle={oracle}
    />
  );
}

export default OracleContainer;
