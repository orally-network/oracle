import React, { useCallback, useEffect, useState } from 'react';
import { Space, Card, Tooltip, Typography } from 'antd';
import {
  LinkOutlined,
  UnorderedListOutlined,
  ArrowRightOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { useAccount } from 'wagmi';
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
        <Button className={styles.data}>{pair}</Button>
      </Link>
    );
  }

  return <Button className={styles.data}>Random ({random})</Button>;
};

const Subscription = ({
  sub,
  addressData,
  signMessage,
  stopSubscription,
  startSubscription,
  withdraw,
}) => {
  const { address } = useAccount();
  const navigate = useNavigate();

  const {
    status: { is_active, last_update, executions_counter },
    method: {
      chain_id,
      name: method_name,
      gas_limit,
      method_type: { Pair: pair, Random: random },
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
    <Card bordered={false} className={styles.subscription}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <ChainLogo chain={chain} />

          <div className={styles.status}>
            <Tooltip title={`Subscription is ${is_active ? '' : 'in'}active`}>
              <div className={is_active ? styles.active : styles.inactive} />
            </Tooltip>
          </div>
        </div>

        <div className={styles.info}>
          <div>{chain.name}</div>
          <Space>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {pair}
            </Typography.Title>
            <Button
              size="small"
              type="text"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate(`/pythia/${id}`)}
            />
          </Space>
        </div>

        <div className={styles.menu}>
          <EllipsisOutlined />
        </div>
      </div>

      <div className={styles.inlineStats}>
        <div className={styles.stat}>
          <div className={styles.label}>Address</div>

          <div className={styles.val}>
            <Typography.Title level={5}>
              {truncateEthAddress(add0x(contract_addr))}{' '}
            </Typography.Title>
            {chain?.blockExplorers?.default?.url && (
              <IconLink
                onClick={stopPropagation}
                link={`${chain.blockExplorers.default.url}/address/${add0x(contract_addr)}`}
                IconComponent={LinkOutlined}
              />
            )}
          </div>
        </div>

        {/* <Data pair={pair} random={random} /> */}
      </div>

      <div className={styles.time}>
        <div className={styles.executions}>
          Repetitions
          <br />
          <Typography.Title level={5}>{Number(executions_counter)}</Typography.Title>
        </div>

        <div className={styles.frequency}>
          Update time
          <Typography.Title level={5}>{(Number(frequency) / 60).toFixed(2)}</Typography.Title>
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        icon={<UnorderedListOutlined />}
        onClick={() => navigate(`/pythia/${id}`)}
        style={{
          width: '100%',
        }}
      >
        View list
      </Button>

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
  );
};

export default Subscription;
