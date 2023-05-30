import { useCallback } from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useSignMessage } from 'wagmi';

import { remove0x } from 'Utils/addressUtils';
import pythiaCanister from 'Canisters/pythiaCanister';
import treasurerCanister from 'Canisters/treasurerCanister';
import { setLocalStorageAddress } from 'Utils/localStorageAddress';
import { useGlobalState } from 'Providers/GlobalState';
import { usePythiaData } from 'Providers/PythiaData';

const useSignature = ({ canister = 'pythia' } = {}) => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { setAddressData } = useGlobalState();
  const { chains } = usePythiaData();
  
  const signMessage = useCallback(async (chainId) => {
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

    console.log({message, messageString, signature: remove0x(signature)});

    const verifyUserMethod = canister === 'pythia' ? pythiaCanister.get_exec_addr : treasurerCanister.register_taxpayer;
    
    console.log({ messageString, signature })
    
    const res = await verifyUserMethod(messageString, remove0x(signature));

    if (res.Err) {
      throw new Error(res.Err);
    }

    const executionAddress = res?.Ok;
    console.log({ message, messageString, signature, executionAddress, res });

    if (executionAddress) {
      const data = setLocalStorageAddress(address, messageString, signature, executionAddress);

      console.log({ data });
      setAddressData(data);
    }
  }, [address, signMessageAsync, setAddressData, chains, canister]);
  
  return {
    signMessage,
  };
};

export default useSignature;
