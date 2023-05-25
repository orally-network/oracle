import React from 'react';
import { Card, Tooltip } from 'antd';

import Control from 'Shared/Control';
import { CHAINS_MAP } from 'Constants/chains';
import ChainLogo from 'Shared/ChainLogo';
import { add0x } from 'Utils/addressUtils';

import styles from './Subscription.scss';

// todo: future options to stop, remove subscription or withdraw funds
const Subscription = ({ sub, addressData, signMessage, stopSubscription, startSubscription, withdraw }) => {
  const { chain_id, contract_addr, method_name, frequency, is_random, id, is_active } = sub;
  
  const chain = CHAINS_MAP[chain_id];
  
  // todo: calculate from exec_address + contract + method_abi. And last execution time.
  const executions = Math.floor(Math.random() * 15) + 3;
  
  return (
    <Card className={styles.subscription}>
      <div className={styles.header}>
        <div className={styles.chain}>
          <ChainLogo chain={chain} />

          <div>{chain.name}</div>
        </div>

        <div className={styles.info}>
          {false && (
            <div className={styles.executions}>
            {executions}
            {' '}
            Executions
          </div>
          )}

          <div className={styles.frequency}>
            {(Number(frequency) / 60).toFixed(2)} mins
          </div>
          
          <div className={styles.status}>
            <Tooltip title={`Subscription is ${is_active ? '' : 'in'}active`}>
              <div
                className={is_active ? styles.active : styles.inactive}
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <div className={styles.stat}>
        <div className={styles.label}>
          Address
        </div>
  
        <div className={styles.val}>
          {add0x(contract_addr)}
        </div>
      </div>
      
      <div className={styles.stat}>
        <div className={styles.label}>
          Method
        </div>

        <div className={styles.val}>
          {method_name}
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
        is_active={is_active}
        addressData={addressData}
        signMessage={signMessage}
        chain={chain}
        subId={id}
        startSubscription={startSubscription}
        stopSubscription={stopSubscription}
        withdraw={withdraw}
      />
    </Card>
  )
};

export default Subscription;
