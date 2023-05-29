import React, { useCallback, useMemo, useState } from 'react';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';
import { Card, Input, Switch } from 'antd';

import Control from 'Shared/Control';
import { CHAINS_MAP } from 'Constants/chains';
import ChainLogo from 'Shared/ChainLogo';
import Button from 'Components/Button';
import logger from 'Utils/logger';
import { usePythiaData } from 'Providers/PythiaData';

import styles from './Subscription.scss';

const mapChainsToOptions = (chains) => {
  return chains.map((chain) => ({
    value: chain.chain_id,
    label: chain.chain_id,
  }));
}

const mapPairsToOptions = (pairs) => {
  return pairs.map((pair) => ({
    value: pair.id,
    label: pair.id,
  }));
};

const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div className={styles.flex}>
      <ChainLogo
        chain={CHAINS_MAP[children]}
      />
      {' '}
      {CHAINS_MAP[props.data.value].name}
    </div>
  </components.SingleValue>
);

const Option = (props) => {
  return (
    <components.Option {...props}>
      <div className={styles.flex}>
        <ChainLogo chain={CHAINS_MAP[props.data.value]} />
        {' '}
        {CHAINS_MAP[props.data.value].name}
      </div>
    </components.Option>
  );
};

// (string, uint256, uint256, uint256), ([string|bytes*|uint*|int*]), ()
const getStrMethodArgs = (isRandom, isFeed) => {
  if (isRandom) {
    return '(uint64)';
  }
  if (isFeed) {
    return '(string, uint256, uint256, uint256)';
  }
  
  return '()';
};

const NewSubscription = ({ addressData, signMessage, subscribe, chains, pairs }) => {
  const [chainId, setChainId] = useState(null);
  const [methodName, setMethodName] = useState('');
  const [addressToCall, setAddressToCall] = useState('');
  const [frequency, setFrequency] = useState(10); // mins
  const [isRandom, setIsRandom] = useState(false);
  const [feed, setFeed] = useState(null);
  const [isEdit, setIsEdit] = useState(true);
  
  const { fetchSubs } = usePythiaData();
  
  const subscribeHandler = useCallback(async () => {
    const res = await toast.promise(
      subscribe({
        chainId,
        methodName: `${methodName}${getStrMethodArgs(isRandom, Boolean(feed))}`,
        addressToCall,
        frequency: Number(frequency) * 60,
        isRandom,
        feed,
      }),
      {
        pending: `Subscribe ${addressToCall}:${methodName} to Pythia`,
        success: `Subscribed successfully`,
        error: {
          render({ error }) {
            logger.error(`Subscribe ${addressToCall}:${methodName} to Pythia`, error);

            return 'Something went wrong. Try again later.';
          }
        },
      }
    );
    
    console.log({ res });
    
    if (!res.Err) {
      fetchSubs();
      // clear state
      setChainId(chains[0]?.chain_id);
      setMethodName('');
      setAddressToCall('');
      setFrequency(10);
      setIsRandom(false);
      setFeed(null);
      setIsEdit(true);
    }
  }, [chainId, methodName, addressToCall, frequency, isRandom, feed, chains, subscribe, fetchSubs]);
  
  const nextHandler = useCallback(() => setIsEdit(!isEdit), [isEdit]);
  
  return (
    <Card className={styles.subscription}>
      <div className={styles.inputs}>
        <div className={styles.stat}>
          <div className={styles.label}>
            Chain
          </div>

          <div className={styles.val}>
            <Select
              setValue={setChainId}
              value={chainId ? { label: chainId, value: chainId } : null}
              className={styles.chainSelect}
              isDisabled={!isEdit}
              styles={{
                singleValue: (base) => ({
                  ...base,
                  borderRadius: 5,
                  display: 'flex',
                }),
              }}
              components={{ SingleValue, Option }}
              options={useMemo(() => mapChainsToOptions(chains), [chains])}
              onChange={useCallback((e) => setChainId(e.value), [])}
            />
          </div>
        </div>
        
        <div className={styles.stat}>
          <div className={styles.label}>
            Address
          </div>

          <div className={styles.val}>
            <Input
              disabled={!isEdit}
              className={styles.input}
              value={addressToCall}
              placeholder="address_to_call"
              onChange={useCallback((e) => setAddressToCall(e.target.value), [])}
            />
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>
            Method
          </div>

          <div className={styles.val}>
            <Input
              disabled={!isEdit}
              className={styles.input}
              value={methodName}
              placeholder="method_name"
              onChange={useCallback((e) => setMethodName(e.target.value), [])}
            />

            {getStrMethodArgs(isRandom, Boolean(feed))}
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>
            Frequency
          </div>

          <div className={styles.val}>
            <Input
              disabled={!isEdit}
              className={styles.input}
              value={frequency}
              min={5}
              type="number"
              placeholder="frequency"
              onChange={useCallback((e) => setFrequency(e.target.value), [])}
            />
            
            mins
          </div>
        </div>
      </div>
      
      <div className={styles.data}>
        <div className={styles.stat}>
          <div className={styles.label}>
            Randomness
          </div>

          <div className={styles.val}>
            <Switch
              disabled={!isEdit}
              className={styles.input}
              checked={isRandom}
              onChange={useCallback((checked) => { { setIsRandom(checked); setFeed(null); } }, [])}
            />
          </div>
        </div>
      </div>

      <div className={styles.data}>
        <div className={styles.stat}>
          <div className={styles.label}>
            Price feed (Sybil)
          </div>

          <div className={styles.val}>
            <Select
              className={styles.chainSelect}
              setValue={setFeed}
              clearValue={() => setFeed(null)}
              isDisabled={!isEdit}
              value={feed ? { label: feed, value: feed } : null}
              isClearable
              options={useMemo(() => mapPairsToOptions(pairs), [pairs])}
              onChange={useCallback((e) => { setFeed(e?.value); setIsRandom(false) }, [])}
            />
          </div>
        </div>
      </div>

      {isEdit ? (
        <Button
          disabled={!chainId || !methodName || !addressToCall || !frequency}
          onClick={nextHandler}
          type="primary"
        >
          Next
        </Button>
      ) : (
        <Button
          className={styles.back}
          onClick={nextHandler}
          type="primary"
        >
          Back
        </Button>
      )}

      {!isEdit && (
        <Control
          disabled={!chainId || !methodName || !addressToCall || !frequency}
          subscribe={subscribeHandler}
          signMessage={signMessage}
          addressData={addressData}
          chain={CHAINS_MAP[chainId]}
        />
      )}
    </Card>
  )
};

export default NewSubscription;
