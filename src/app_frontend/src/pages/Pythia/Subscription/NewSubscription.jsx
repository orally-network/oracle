import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import { toast } from 'react-toastify';
import { Card, Input, Switch, Select as AntdSelect } from 'antd';

import Control from 'Shared/Control';
import { CHAINS_MAP } from 'Constants/chains';
import ChainLogo from 'Shared/ChainLogo';
import Button from 'Components/Button';
import logger from 'Utils/logger';
import { usePythiaData } from 'Providers/PythiaData';

import { mapChainsToOptions, mapPairsToOptions, getStrMethodArgs, RAND_METHOD_TYPES } from '../helper';

import styles from './Subscription.scss';

// TODO: Refactor Chain selector.
export const SingleValue = ({ children, ...props }) => (
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

export const Option = (props) => {
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



const NewSubscription = ({ addressData, signMessage, subscribe, pairs }) => {
  const [chainId, setChainId] = useState(null);
  const [methodName, setMethodName] = useState('');
  const [methodArg, setMethodArg] = useState(RAND_METHOD_TYPES[0]);
  const [addressToCall, setAddressToCall] = useState('');
  const [frequency, setFrequency] = useState(60); // mins
  const [gasLimit, setGasLimit] = useState(null);
  const [isRandom, setIsRandom] = useState(false);
  const [feed, setFeed] = useState(null);
  const [isEdit, setIsEdit] = useState(true);
  
  const [balance, setBalance] = useState(0);
  
  const { fetchSubs, chains, fetchBalance, pma, isBalanceLoading } = usePythiaData();
  
  const refetchBalance = useCallback(async () => {
    setBalance(await fetchBalance(chainId, addressData.address));
  }, [chainId, addressData]);
  
  useEffect(() => {
    if (chainId && addressData) {
      refetchBalance();
    }
  }, [chainId, addressData]);
  
  const subscribeHandler = useCallback(async () => {
    const payload = {
      chainId,
      methodName: `${methodName}(${feed ? getStrMethodArgs(feed) : methodArg})`,
      addressToCall,
      frequency: Number(frequency) * 60,
      gasLimit,
      isRandom,
      feed,
    };
    
    console.log({ payload });
    
    const res = await toast.promise(
      subscribe(payload),
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
      setGasLimit(null);
      setIsRandom(false);
      setFeed(null);
      setIsEdit(true);
    }
  }, [chainId, methodName, addressToCall, frequency, isRandom, feed, chains, subscribe, fetchSubs, gasLimit, methodArg]);

  const getMethodAddon = () => {
    return isRandom ? (
      <AntdSelect value={methodArg} onChange={setMethodArg}>
        {RAND_METHOD_TYPES.map(type => <AntdSelect.Option value={type}>{type}</AntdSelect.Option>)}
      </AntdSelect>
    ) : (
      getStrMethodArgs(Boolean(feed))
    )
  }

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
              addonAfter={getMethodAddon()}
              onChange={useCallback((e) => setMethodName(e.target.value), [])}
            />
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>
            Frequency
          </div>

          <div className={styles.val}>
          <AntdSelect
            value={frequency}
            onChange={setFrequency}
            addonAfter="mins"
            options={[
              { value: 30, label: "30 min" },
              { value: 60, label: "60 min" },
            ]}
          />
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>
            Gas Limit
          </div>

          <div className={styles.val}>
            <Input
              disabled={!isEdit}
              className={styles.input}
              value={gasLimit}
              type="number"
              placeholder="21000"
              onChange={useCallback((e) => setGasLimit(e.target.value), [])}
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
          balance={balance}
          executionAddress={pma}
          refetchBalance={refetchBalance}
          isBalanceLoading={isBalanceLoading}
          chain={CHAINS_MAP[chainId]}
        />
      )}
    </Card>
  )
};

export default NewSubscription;
