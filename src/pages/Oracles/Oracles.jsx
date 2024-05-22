import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { oracle_factory } from 'Declarations/oracle_factory';
import { getLocalStorageAddress } from 'Utils/localStorageAddress';

import Oracle from './Oracle';

import styles from './Oracles.scss';

const Oracles = () => {
  const [oracles, setOracles] = useState([]);
  const [addressData, setAddressData] = useState();
  
  const { address } = useAccount();

  useEffect(() => {
    const fetch = async () => {
      setOracles(
        await oracle_factory.get_oracles()
      );
    };

    fetch();
  }, []);

  useEffect(() => {
    if (address) {
      setAddressData(getLocalStorageAddress(address.toLowerCase()));
    }
  }, [address]);

  return (
    <div className={styles.oracles}>
      {oracles.map(oracleId => <Oracle key={oracleId} oracleId={oracleId} addressData={addressData} setAddressData={setAddressData} />)}
    </div>
  );
};

export default Oracles;
