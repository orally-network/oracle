import React, { useCallback, useEffect, useState } from 'react';
import { Card, Tooltip } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';
import { FaRepeat } from 'react-icons/fa6';
import { BiTimeFive } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';

import Control from 'Shared/Control';
import { CHAINS_MAP } from 'Constants/chains';
import ChainLogo from 'Shared/ChainLogo';
import { add0x } from 'Utils/addressUtils';
import IconLink from 'Components/IconLink';
import { usePythiaData } from 'Providers/PythiaData';
import { truncateEthAddress } from 'Utils/addressUtils';
import { stopPropagation } from 'Utils/reactUtils';
import Button from 'Components/Button';

import styles from './Subscription.scss';

const Data = ({ pair, random }) => {
  if (pair) {
    return (
      <Link to={`/sybil/${pair}`} onClick={stopPropagation}>
        <Button className={styles.data}>
          {pair}
        </Button>
      </Link>
    )
  }
  
  return (
    <Button className={styles.data}>
      Random ({random})
    </Button>
  )
}

const Subscription = ({ sub, addressData, signMessage, stopSubscription, startSubscription, withdraw }) => {
  const { address } = useAccount();
  const navigate = useNavigate();

  const {
    status: { is_active, last_update, executions_counter },
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
    id,
  } = sub;

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
  
  return (
    <Card className={styles.subscription} onClick={() => navigate(`/pythia/${id}`)}>
      <div className={styles.header}>
        <div className={styles.chain}>
          <Tooltip title={chain.name}>
            <ChainLogo chain={chain} />
          </Tooltip>
        </div>

        <div className={styles.info}>
          <Tooltip title="Executions">
            <div className={styles.executions}>
              {Number(executions_counter)}
              
              <FaRepeat className={styles.icon} />
            </div>
          </Tooltip>

          <Tooltip title="mins">
            <div className={styles.frequency}>
              {(Number(frequency) / 60).toFixed(2)}

              <BiTimeFive className={styles.icon} />
            </div>
          </Tooltip>
          
          <div className={styles.status}>
            <Tooltip title={`Subscription is ${is_active ? '' : 'in'}active`}>
              <div
                className={is_active ? styles.active : styles.inactive}
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <div className={styles.inlineStats}>
        <div className={styles.stat}>
          <div className={styles.label}>
            Address
          </div>
    
          <div className={styles.val}>
            {truncateEthAddress(add0x(contract_addr))}
            {' '}
            {chain?.blockExplorers?.default?.url && (
              <IconLink
                onClick={stopPropagation}
                link={`${chain.blockExplorers.default.url}/address/${add0x(contract_addr)}`}
                IconComponent={LinkOutlined}
              />
            )}
          </div>
        </div>

        <Data pair={pair} random={random} />
      </div>

      <Tooltip title="Last execution">
        <div className={styles.lastExecution}>
          {last_update ? new Date(Number(last_update) * 1000).toLocaleString() : 'Never'}
        </div>
      </Tooltip>

      {owner === address?.toLowerCase() && (
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
      )}
    </Card>
  )
};

export default Subscription;
