import React, { useCallback, useMemo, useState } from 'react';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';

import Card from 'Components/Card';
import Control from 'Shared/Control';
import { CHAINS_MAP } from 'Constants/chains';
import ChainLogo from 'Shared/ChainLogo';
import Input from 'Components/Input';
import Button from 'Components/Button';
import logger from 'Utils/logger';

import styles from './Subscription.scss';

const FEED_OPTIONS_MOCK = [
  {
    value: 'BTC/USD',
    label: 'BTC/USD',
  },
  {
    value: 'ETH/USD',
    label: 'ETH/USD',
  },
  {
    value: 'ICP/USD',
    label: 'ICP/USD',
  },
];

const mapChainsToOptions = (chains) => {
  return chains.map((chain) => ({
    value: chain.chain_id,
    label: chain.chain_id,
  }));
}

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

const getStrMethodArgs = (isRandom, isFeed) => {
  if (isRandom) {
    return '(uint64)';
  }
  if (isFeed) {
    return '(uint64)';
  }
  
  return '()';
};

const NewSubscription = ({ addressData, signMessage, subscribe, chains }) => {
  const [chainId, setChainId] = useState(chains[0]?.chain_id);
  const [methodName, setMethodName] = useState('');
  const [addressToCall, setAddressToCall] = useState('');
  const [frequency, setFrequency] = useState(60); // seconds
  const [isRandom, setIsRandom] = useState(false);
  const [feed, setFeed] = useState(null);
  const [isEdit, setIsEdit] = useState(true);
  
  const chainOptions = useMemo(() => mapChainsToOptions(chains), [chains]);
  
  const subscribeHandler = useCallback(async () => {
    const res = await toast.promise(
      subscribe({
        chainId,
        methodName: `${methodName}${getStrMethodArgs(isRandom, Boolean(feed))}`,
        addressToCall,
        frequency,
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
      // refetch subs
      // clear state
      setChainId(chains[0]?.chain_id);
      setMethodName('');
      setAddressToCall('');
      setFrequency(60);
      setIsRandom(false);
      setFeed(null);
      setIsEdit(true);
    }
  }, [chainId, methodName, addressToCall, frequency, isRandom, feed, chains]);
  
  const nextHandler = useCallback(() => setIsEdit(!isEdit), [isEdit]);
  
  return (
    <Card className={styles.subscription}>
      <div className={styles.chainSelect}>
        <Select
          // defaultValue={chainOptions[0]?.value}
          isDisabled={!isEdit}
          styles={{
            singleValue: (base) => ({
              ...base,
              borderRadius: 5,
              display: 'flex',
            }),
          }}
          components={{ SingleValue, Option }}
          options={chainOptions}
          onChange={useCallback((e) => setChainId(e.value), [])}
        />
      </div>
      
      <div className={styles.inputs}>
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
              type="number"
              placeholder="frequency"
              onChange={useCallback((e) => setFrequency(e.target.value), [])}
            />
          </div>
        </div>
      </div>
      
      <div className={styles.data}>
        <div className={styles.stat}>
          <div className={styles.label}>
            Randomness
          </div>

          <div className={styles.val}>
            <Input
              disabled={!isEdit}
              className={styles.input}
              checked={isRandom}
              type="checkbox"
              onChange={useCallback((e) => { { setIsRandom(e.target.checked); setFeed(null); } }, [])}
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
              isDisabled={!isEdit}
              isClearable
              options={FEED_OPTIONS_MOCK}
              onChange={useCallback((e) => { setFeed(e?.value); setIsRandom(false) }, [])}
            />
          </div>
        </div>
      </div>

      {isEdit ? (
        <Button
          // className={styles.topUp}
          disabled={!chainId || !methodName || !addressToCall || !frequency}
          onClick={nextHandler}
        >
          Next
        </Button>
      ) : (
        <Button
          className={styles.back}
          onClick={nextHandler}
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
