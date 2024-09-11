import { useCallback } from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useSignMessage } from 'wagmi';

import { setLocalStorageAddress } from 'Utils/localStorageAddress';
import { useGlobalState } from 'Providers/GlobalState';
import { usePythiaData } from 'Providers/PythiaData';

const useSignature = ({ canister = 'pythia' } = {}) => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { setAddressData } = useGlobalState();
  const { chains } = usePythiaData();

  const signMessage = useCallback(
    async (chainId) => {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: `Sign in with Ethereum to the ${canister}.`,
        uri: window.location.origin,
        version: '1',
        chainId: String(chainId),
      });
      const messageString = message.prepareMessage();

      const signature = await signMessageAsync({
        message: messageString,
      });

      const data = setLocalStorageAddress(address, messageString, signature);

      console.log({ data });
      setAddressData(data);
    },
    [address, signMessageAsync, setAddressData, chains, canister],
  );

  return {
    signMessage,
  };
};

export default useSignature;
