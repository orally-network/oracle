import React from 'react';

import Card from 'Components/Card';
import Control from 'Shared/Control';
import { CHAINS_MAP } from 'Constants/chains';

import styles from './Subscription.scss';

// todo: future options to stop, remove subscription or withdraw funds
const Subscription = ({ sub, addressData, signMessage, subscribe }) => {
  const { chain_id, contract_addr, method_abi, frequency, is_random } = sub;
  
  const chain = CHAINS_MAP[chain_id];
  
  // todo: calculate from exec_address + contract + method_abi. And last execution time.
  const executions = Math.floor(Math.random() * 15) + 3;
  
  return (
    <Card className={styles.subscription}>
      <div className={styles.header}>
        <div className={styles.chain}>
          {typeof chain.img === 'string' && <img className={styles.logo} src={chain.img} alt={chain.name} />}
          {typeof chain.img !== 'string' && <chain.img className={styles.logo} />}

          <div>{chain.name}</div>
        </div>

        <div className={styles.info}>
          <div className={styles.executions}>
            {executions}
            {' '}
            Executions
          </div>

          <div className={styles.frequency}>
            {(Number(frequency) / 60).toFixed(2)} mins
          </div>
        </div>
      </div>

      <div className={styles.stat}>
        <div className={styles.label}>
          Address
        </div>
  
        <div className={styles.val}>
          {contract_addr}
        </div>
      </div>
      
      <div className={styles.stat}>
        <div className={styles.label}>
          Method
        </div>

        <div className={styles.val}>
          {method_abi}
        </div>
      </div>

      {is_random && (
        <div className={styles.stat}>
          <div className={styles.label}>
            Data
          </div>

          <div className={styles.val}>
            Random vector of bytes
          </div>
        </div>
      )}

      <Control
        subscribed
        addressData={addressData}
        signMessage={signMessage}
        chain={chain}
        subscribe={subscribe}
      />
    </Card>
  )
};

export default Subscription;
