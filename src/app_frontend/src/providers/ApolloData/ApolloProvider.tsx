import React, { useCallback, useEffect, useState } from 'react';
import { ApolloDataContext } from './ApolloContext';
import apolloCanister from 'Canisters/apolloCanister';
import { GeneralResponse } from 'Interfaces/common';
import { useGlobalState } from 'Providers/GlobalState';
import { remove0x } from 'Utils/addressUtils';
import logger from 'Utils/logger';

export const ApolloDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = useState<number>(1);
  const { addressData } = useGlobalState();
  const [ama, setAma] = useState<`0x${string}`>('0x');

  const fetchAma = useCallback(async (chainId: number) => {
    const ama: GeneralResponse = await apolloCanister.get_ama(chainId);

    console.log({ ama });
    if (ama.Ok) {
      setAma(ama.Ok);
    } else {
      logger.error(`Failed to get pma, ${ama.Err}`);
    }
  }, []);

  const deposit = useCallback(
    async (chainId: string, tx_hash: string) => {
      const res: GeneralResponse = await apolloCanister.deposit(
        chainId,
        tx_hash,
        [],
        addressData.message,
        remove0x(addressData.signature)
      );

      console.log('deposit res', res);
      if (res.Err) {
        logger.error(`Failed to deposit ${tx_hash}, ${res.Err}`);
        throw new Error(`Failed to deposit ${tx_hash}, ${res.Err}`);
      }
      return res;
    },
    [addressData]
  );
  
  const value = {
    items: [],
    page,
    setPage,
    deposit,
    ama,
    fetchAma
  };


  return <ApolloDataContext.Provider value={value}>{children}</ApolloDataContext.Provider>;
};
