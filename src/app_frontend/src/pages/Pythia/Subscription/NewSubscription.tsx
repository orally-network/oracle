import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Input, Switch, Select as AntdSelect, Flex, Tag, Space, Tooltip } from 'antd';

import Control from 'Shared/Control';
import { CHAINS_MAP } from 'Constants/chains';
import Button from 'Components/Button';
import logger from 'Utils/logger';
import { usePythiaData } from 'Providers/PythiaData';

import {
  mapChainsToOptions,
  mapPairsToOptions,
  getStrMethodArgs,
  RAND_METHOD_TYPES,
  convertFrequencyToSeconds,
} from 'Utils/helper';

import styles from './Subscription.scss';
import { SingleValueSelect } from 'Components/Select';
import { OptionType, Unit } from 'Interfaces/subscription';
import { FREQUENCY_UNITS, MIN_BALANCE, MIN_FREQUENCY } from 'Constants/ui';

export interface NewSubscriptionProps {
  addressData: any;
  signMessage: any;
  subscribe: any;
  pairs: any;
}

type FrequencyType = {
  value: number | null;
  units: Unit;
};

const NewSubscription = ({ addressData, signMessage, subscribe, pairs }: NewSubscriptionProps) => {
  const [chainId, setChainId] = useState<string | null>(null);
  const [methodName, setMethodName] = useState('');
  const [methodArg, setMethodArg] = useState(RAND_METHOD_TYPES[0]);
  const [addressToCall, setAddressToCall] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>({ value: null, units: 'min' }); // mins
  const [gasLimit, setGasLimit] = useState<string>('');
  const [isRandom, setIsRandom] = useState(false);
  const [feed, setFeed] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(true);

  const [balance, setBalance] = useState(0);

  const { fetchSubs, chains, fetchBalance, pma, isBalanceLoading } = usePythiaData();

  const refetchBalance = useCallback(async () => {
    setBalance(await fetchBalance(chainId, addressData.address));
  }, [chainId, addressData, fetchBalance]);

  useEffect(() => {
    if (chainId && addressData) {
      refetchBalance();
    }
  }, [chainId, addressData, refetchBalance]);

  const subscribeHandler = useCallback(async () => {
    const payload = {
      chainId,
      methodName: `${methodName}(${feed ? getStrMethodArgs(Boolean(feed)) : methodArg})`,
      addressToCall,
      frequency:
        frequency.value !== null
          ? convertFrequencyToSeconds(frequency.value, frequency.units)
          : MIN_FREQUENCY,
      gasLimit,
      isRandom,
      feed,
    };

    console.log({ payload });

    const res = await toast.promise(subscribe(payload), {
      pending: `Subscribe ${addressToCall}:${methodName} to Pythia`,
      success: `Subscribed successfully`,
      error: {
        render({ error }) {
          logger.error(`Subscribe ${addressToCall}:${methodName} to Pythia`, error);

          return 'Something went wrong. Try again later.';
        },
      },
    });

    console.log({ res });

    if (!res.Err) {
      fetchSubs();
      // clear state
      setChainId(chains[0]?.chain_id);
      setMethodName('');
      setAddressToCall('');
      setFrequency({ value: 0, units: 'min' });
      setGasLimit('');
      setIsRandom(false);
      setFeed(null);
      setIsEdit(true);
    }
  }, [
    chainId,
    methodName,
    addressToCall,
    frequency,
    isRandom,
    feed,
    chains,
    subscribe,
    fetchSubs,
    gasLimit,
    methodArg,
  ]);

  const getMethodAddon = () => {
    return isRandom ? (
      <AntdSelect value={methodArg} onChange={setMethodArg}>
        {RAND_METHOD_TYPES.map((type) => (
          <AntdSelect.Option key={type} value={type}>
            {type}
          </AntdSelect.Option>
        ))}
      </AntdSelect>
    ) : (
      getStrMethodArgs(Boolean(feed))
    );
  };

  const nextHandler = useCallback(() => setIsEdit(!isEdit), [isEdit]);

  return (
    <Flex vertical={true} gap="middle">
      <div className={styles.label}>Chain</div>

      <SingleValueSelect
        className={styles.chainSelect}
        classNamePrefix="react-select"
        isDisabled={!isEdit}
        options={useMemo(() => mapChainsToOptions(chains), [chains])}
        onChange={useCallback((e: OptionType) => setChainId(e.value), [])}
      />

      <Input
        disabled={!isEdit}
        className={styles.input}
        value={addressToCall}
        placeholder="Address"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressToCall(e.target.value)}
      />

      <Input
        disabled={!isEdit}
        className={styles.input}
        value={methodName}
        placeholder="Method"
        addonAfter={getMethodAddon()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMethodName(e.target.value)}
      />

      <div className={styles.label}>Frequency</div>

      <Space>
        <Tooltip title="Minimum 30 minutes and maximum 6 months">
          <Input
            pattern="[0-9]*"
            disabled={!isEdit}
            className={styles.input}
            value={frequency.value?.toString()}
            placeholder="Quantity"
            style={{ minWidth: '100px' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFrequency({ value: +e.target.value, units: 'min' })
            }
          />
        </Tooltip>

        {FREQUENCY_UNITS.map((unit) => (
          <Tag
            key={unit}
            style={{
              cursor: 'pointer',
            }}
            color={frequency.units === unit ? '#1766F9' : 'default'}
            onClick={() => setFrequency({ ...frequency, units: unit })}
          >
            {unit}
          </Tag>
        ))}
      </Space>

      <Input
        pattern="[0-9]*"
        disabled={!isEdit}
        className={styles.input}
        value={gasLimit}
        placeholder="Gas limit"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGasLimit(e.target.value)}
      />

      <Space size="large">
        <Select
          placeholder="Price feed (Sybil)"
          className={styles.chainSelect}
          classNamePrefix="react-select"
          isDisabled={!isEdit}
          value={feed ? { label: feed, value: feed } : null}
          isClearable
          menuShouldScrollIntoView={false}
          options={useMemo(() => mapPairsToOptions(pairs), [pairs])}
          onChange={(e: OptionType) => {
            setFeed(e?.value);
            setIsRandom(false);
          }}
        />
        <Space>
          <Switch
            disabled={!isEdit}
            className={styles.input}
            checked={isRandom}
            onChange={(checked: boolean) => {
              {
                setIsRandom(checked);
                setFeed(null);
              }
            }}
          />
          Randomness
        </Space>
      </Space>

      <Flex justify="flex-end" gap="large" style={{ paddingTop: '1rem' }}>
        {isEdit ? (
          <Button
            disabled={!chainId || !methodName || !addressToCall || !frequency}
            onClick={nextHandler}
            type="primary"
            className={styles.nextBtn}
            style={{ alignSelf: 'flex-end' }}
          >
            Next
          </Button>
        ) : (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Control
              disabled={!chainId || !methodName || !addressToCall || !frequency}
              // subscribe={subscribeHandler}
              signMessage={signMessage}
              addressData={addressData}
              balance={balance}
              executionAddress={pma}
              refetchBalance={refetchBalance}
              isBalanceLoading={isBalanceLoading}
              chain={chainId !== null && CHAINS_MAP[chainId]}
            />

            <Flex justify="space-between">
              <Button type="link" className={styles.back} onClick={nextHandler}>
                Back
              </Button>

              <Button
                className={styles.subscribe}
                disabled={
                  balance < MIN_BALANCE || !chainId || !methodName || !addressToCall || !frequency
                }
                onClick={subscribe}
                type="primary"
              >
                Subscribe
              </Button>
            </Flex>
          </Space>
        )}
      </Flex>
    </Flex>
  );
};

export default NewSubscription;
