import React, { useEffect, useState, useMemo } from 'react';
import { useAccount } from 'wagmi';

import { getLocalStorageAddress } from 'Utils/localStorageAddress';

import Subscription from './Subscription';

import styles from './Pythia.scss';

export const PYTHIA_PREFIX = 'pythia-';

// generate mock subs for ethereum, polygon testnets
const mockSubs = [
  {
    chain_id: 5,
    contract_addr: '0x0000000000000',
    method_abi: 'trigger()',
    frequency: 10 * 60, // secs
    is_random: false,
  },
  {
    chain_id: 80001,
    contract_addr: '0x0000000000000',
    method_abi: 'trigger_with_rand(bytes32)',
    frequency: 10 * 60, // secs
    is_random: true,
  },
  {
    chain_id: 35443,
    contract_addr: '0x0000000000000',
    method_abi: 'trigger_with_rand(bytes32)',
    frequency: 10 * 60, // secs
    is_random: true,
  },
  {
    chain_id: 1313161555,
    contract_addr: '0x0000000000000',
    method_abi: 'trigger_with_rand(bytes32)',
    frequency: 10 * 60, // secs
    is_random: true,
  },
];

const mockChains = [
  {
    chain_id: 5,
  },
  {
    chain_id: 80001,
  },
  {
    chain_id: 35443,
  },
  {
    chain_id: 1313161555,
  },
]

const Pythia = () => {
  const [subs, setSubs] = useState([]);
  const [chains, setChains] = useState([]);
  const [addressData, setAddressData] = useState();

  const { address } = useAccount();

  useEffect(() => {
    const fetch = async () => {
      return new Promise(resolve => {
        setTimeout(() => {
          setSubs(mockSubs);
          setChains(mockChains);
          
          resolve([mockSubs, mockChains]);
        }, 100);
      })
    };

    fetch();
  }, []);

  useEffect(() => {
    if (address) {
      setAddressData(getLocalStorageAddress(address, PYTHIA_PREFIX));
    }
  }, [address]);
  
  return (
    <div className={styles.pythia}>
      <>
        {subs.map((sub, i) => <Subscription key={i} sub={sub} addressData={addressData} setAddressData={setAddressData} />)}

        <Subscription isNew addressData={addressData} setAddressData={setAddressData} chains={chains} />
      </>
    </div>
  );
};

export default Pythia;
