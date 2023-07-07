import React, { useCallback, useEffect, useState } from 'react';
import { Card, Tooltip } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';

import Control from 'Shared/Control';
import { CHAINS_MAP } from 'Constants/chains';
import ChainLogo from 'Shared/ChainLogo';
import { add0x } from 'Utils/addressUtils';
import IconLink from 'Components/IconLink';
import { usePythiaData } from 'Providers/PythiaData';

import styles from './Subscription.scss';

// todo: future options to stop, remove subscription or withdraw funds
const Subscription = ({ sub, addressData, signMessage, stopSubscription, startSubscription, withdraw }) => {
  const { address } = useAccount();

  const {
    status: { is_active, last_update },
    method: {
      chain_id,
      name: method_name,
      gas_limit,
      method_type: {
        Pair: pair,
        Random: random,
      }
    },
    owner,
    contract_addr,
    frequency,
    // TODO: Outdated?
    is_random,
    id,
  } = sub;
  

  console.log({gas_limit})
  
  const chain = CHAINS_MAP[chain_id];
  
  const [balance, setBalance] = useState(0);

  const { pma, isBalanceLoading, fetchBalance } = usePythiaData();

  const refetchBalance = useCallback(async () => {
    setBalance(await fetchBalance(chain_id, addressData.address));
  }, [chain_id, addressData]);

  useEffect(() => {
    if (chain_id && addressData) {
      refetchBalance();
    }
  }, [chain_id, addressData]);

  console.log({ chain })

  const getData = () => {
    return pair
      ? pair
      : `Random (${random})`
  }
  
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
          {' '}
          {chain?.blockExplorers?.default?.url && (
            <IconLink
              link={`${chain.blockExplorers.default.url}/address/${add0x(contract_addr)}`}
              IconComponent={LinkOutlined}
            />
          )}
        </div>
      </div>

      <div className={styles.stat}>
        <div className={styles.label}>
          Owner
        </div>

        <div className={styles.val}>
          {owner === address ? "Me" : owner}
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

      <div className={styles.stat}>
        <div className={styles.label}>
          Data
        </div>

        <div className={styles.val}>
          {getData()}
        </div>
      </div>

      <div className={styles.stat}>
        <div className={styles.label}>
          Gas limit
        </div>

        <div className={styles.val}>
          {Number(gas_limit)}
        </div>
      </div>

      <div className={styles.stat}>
        <div className={styles.label}>
          Last execution
        </div>

        <div className={styles.val}>
          {last_update ? new Date(Number(last_update) * 1000).toLocaleString() : 'Never'}
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
        balance={balance}
        executionAddress={pma}
        isBalanceLoading={isBalanceLoading}
        startSubscription={startSubscription}
        refetchBalance={refetchBalance}
        stopSubscription={stopSubscription}
        withdraw={withdraw}
      />
    </Card>
  )
};

export default Subscription;
