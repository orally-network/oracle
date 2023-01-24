import React from 'react';

import Card from 'Components/Card';
import { CHAINS_MAP } from 'Constants/chains';

import styles from './Oracle.scss';

const Oracle = ({ payload }) => {
  console.log(payload, CHAINS_MAP[payload.chain_id]);

  const chain = CHAINS_MAP[payload.chain_id];

  return (
    <Card className={styles.oracle}>
      <div className={styles.header}>
        <div className={styles.chain}>
          <img src={chain.img} alt={chain.name} />

          <div>{chain.name}</div>
        </div>

        <div className={styles.frequency}>
          {Number(payload.frequency) / 60} mins
        </div>
      </div>

      <div className={styles.endpoints}>
        <div className={styles.label}>
          Sources
        </div>

        {payload.endpoints.map((endpoint, index) => (
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
          {new URL(payload.rpc).hostname}
        </div>
      </div>
    </Card>
  );
};

export default Oracle;
