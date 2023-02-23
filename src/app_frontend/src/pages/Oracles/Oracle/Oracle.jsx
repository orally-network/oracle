import React from 'react';

import Card from 'Components/Card';

import Control from './Control';
import styles from './Oracle.scss';

// 1. connect
// 2. sign message
// 3. address, balance, top up (modal flow with input) + subscribe (modal flow with contract, method, abi file)

const Oracle = ({ oracleId, addressData, signMessage, state, oracle }) => {
  const {
    fetcher, chain, subscriptions, chain_id, factory_address, rpc,
  } = state;
  
  console.log({oracleId, fetcher, chain, subscriptions, chain_id, factory_address, addressData });

  return (
    <Card className={styles.oracle}>
      <div className={styles.header}>
        <div className={styles.chain}>
          <img src={chain.img} alt={chain.name} />

          <div>{chain.name}</div>
        </div>

        <div className={styles.frequency}>
          {(Number(fetcher.frequency) / 60).toFixed(2)} mins
        </div>
      </div>

      <div className={styles.endpoints}>
        <div className={styles.label}>
          Sources
        </div>

        {fetcher.endpoints.map((endpoint, index) => (
          <div key={index} className={styles.endpoint}>
            {endpoint.url}
          </div>
        ))}
      </div>

      <div className={styles.rpcWrapper}>
        <div className={styles.label}>
          Rpc
        </div>

        <div className={styles.rpc}>
          {new URL(rpc).hostname}
        </div>
      </div>

      <Control
        addressData={addressData}
        signMessage={signMessage}
        chain={chain}
        oracle={oracle}
      />
    </Card>
  );
};

export default Oracle;
