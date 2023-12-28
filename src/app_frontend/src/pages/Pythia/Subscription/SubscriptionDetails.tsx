import React, { useState, useMemo } from 'react';
import { Flex, Input, Space, Button, Tooltip, Switch, Radio } from 'antd';
import { SingleValueSelect } from 'Components/Select';
import pythiaCanister from 'Canisters/pythiaCanister';
import { remove0x } from 'Utils/addressUtils';
import { useGlobalState } from 'Providers/GlobalState';
import { FrequencyType, OptionType, Subscription } from 'Interfaces/subscription';
import {
  RAND_METHOD_TYPES,
  convertFrequencyDate,
  convertFrequencyToSeconds,
  getStrMethodArgs,
  mapChainsToOptions,
  mapPairsToOptions,
} from 'Utils/helper';
import logger from 'Utils/logger';
import { usePythiaData } from 'Providers/PythiaData';
import { BREAK_POINT_MOBILE, FREQUENCY_UNITS, MIN_FREQUENCY } from 'Constants/ui';
import { getMethodAddon } from './NewSubscription';
import { useAccount } from 'wagmi';
import Select from 'react-select';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { toast } from 'react-toastify';
import { useGetSybilFeeds } from 'ApiHooks/useGetSybilFeeds';

import styles from './Subscription.scss';

interface SubscriptionDetailsProps {
  subscription: Subscription;
}

export const SubscriptionDetails = ({ subscription }: SubscriptionDetailsProps) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { address } = useAccount();
  const [chainId, setChainId] = useState<string>(subscription.method.chain_id);
  const [methodName, setMethodName] = useState(subscription.method.name);
  const [methodArg, setMethodArg] = useState(RAND_METHOD_TYPES[0]);

  const [addressToCall, setAddressToCall] = useState(subscription.contract_addr);
  const [frequency, setFrequency] = useState<FrequencyType>({
    value:
      subscription.method.exec_condition && subscription.method.exec_condition.length > 0
        ? convertFrequencyDate(Number(subscription.method.exec_condition[0].Frequency)).value
        : null,
    units:
      subscription.method.exec_condition && subscription.method.exec_condition.length > 0
        ? convertFrequencyDate(Number(subscription.method.exec_condition[0].Frequency)).units
        : 'min',
  });
  const [gasLimit, setGasLimit] = useState<string>(subscription.method.gas_limit.toString());
  const [isRandom, setIsRandom] = useState(subscription.method.method_type.Random);
  const [feed, setFeed] = useState<string | null>(subscription.method?.method_type?.Pair || null);

  const viewOnly = subscription.owner !== address?.toLowerCase?.();

  const { addressData } = useGlobalState();
  const { chains } = usePythiaData();
  const pairs = useGetSybilFeeds({ page: 1 });
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const updateSubscription = async ({
    chainId,
    methodName,
    addressToCall,
    frequency,
    gasLimit,
    isRandom,
    feed,
  }: {
    chainId: string;
    methodName: string;
    addressToCall: string;
    frequency: number;
    gasLimit: string;
    isRandom: boolean;
    feed: string | null;
  }) => {
    // optional fields should be wrapped in an array
    const payload = {
      id: subscription.id,
      msg: addressData.message,
      sig: remove0x(addressData.signature),
      contract_addr: [remove0x(addressToCall)],
      method_abi: [`${methodName}(${feed ? getStrMethodArgs(Boolean(feed)) : methodArg})`],
      frequency_condition: [BigInt(frequency)],
      is_random: isRandom === undefined ? [false] : [true],
      chain_id: chainId,
      gas_limit: gasLimit ? [BigInt(gasLimit)] : [],
      pair_id: feed ? [feed] : [],
      price_mutation_condition: [],
    };

    const res = await pythiaCanister.update_subscription(payload);
    console.log({ res });

    if (res.Err) {
      logger.error(`Failed to update to ${addressToCall}, ${res.Err}`);

      throw new Error(res.Err);
    }

    return res;
  };

  const onUpdateHandler = async () => {
    setIsUpdating(true);
    try {
      await updateSubscription({
        chainId,
        methodName,
        addressToCall,
        frequency:
          frequency.value !== null
            ? convertFrequencyToSeconds(frequency.value, frequency.units)
            : MIN_FREQUENCY,
        gasLimit,
        isRandom,
        feed,
      });
      toast.success('Subscription is updated successfully');
    } catch (error) {
      console.log({ error });
      toast.error('Something went wrong. Try again later.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Flex vertical={true} gap="middle">
      <Space direction="vertical">
        <div className={styles.label}>Chain</div>
        <SingleValueSelect
          isDisabled={viewOnly}
          value={{ value: chainId, label: chainId }}
          classNamePrefix="react-select"
          options={useMemo(() => mapChainsToOptions(chains), [chains])}
          onChange={(e: OptionType) => setChainId(e.value)}
        />
      </Space>
      <Space direction="vertical">
        <div className={styles.label}>Address</div>
        <Input
          disabled={viewOnly}
          value={addressToCall}
          placeholder="Address"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressToCall(e.target.value)}
        />
      </Space>
      <Space direction="vertical">
        <div className={styles.label}>Method</div>
        <Input
          disabled={viewOnly}
          value={methodName}
          placeholder="Method"
          addonAfter={getMethodAddon({ isRandom, methodArg, setMethodArg, feed })}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMethodName(e.target.value)}
        />
      </Space>

      <Space direction="vertical">
        <div className={styles.label}>Frequency</div>
        <Tooltip title="Minimum 30 minutes and maximum 6 months">
          <Input
            pattern="[0-9]*"
            disabled={viewOnly}
            value={frequency.value?.toString()}
            placeholder="Quantity"
            style={{ minWidth: '100px' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFrequency({ value: +e.target.value, units: 'min' })
            }
          />
        </Tooltip>
        <Flex gap="small" wrap="wrap">
          <Radio.Group
            onChange={(e) =>
              !viewOnly ? setFrequency({ ...frequency, units: e.target.value }) : null
            }
            value={frequency.units}
          >
            {FREQUENCY_UNITS.map((unit) => (
              <Radio key={unit} value={unit}>
                {unit}
              </Radio>
            ))}
          </Radio.Group>
        </Flex>
      </Space>

      <Space direction="vertical">
        <div className={styles.label}>Gas limit</div>
        <Input
          pattern="[0-9]*"
          disabled={viewOnly}
          value={gasLimit}
          placeholder="Gas limit"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGasLimit(e.target.value)}
        />
      </Space>
      <div className={styles.label}>Price feed (Sybil)</div>
      <Space size="large" direction={isMobile ? 'vertical' : 'horizontal'}>
        <Select
          placeholder="Price feed"
          classNamePrefix="react-select"
          isDisabled={viewOnly}
          value={feed ? { label: feed, value: feed } : null}
          isClearable
          menuShouldScrollIntoView={false}
          options={useMemo(
            () =>
              mapPairsToOptions(
                pairs && pairs.data && pairs.data.items?.length ? pairs.data.items : []
              ),
            [pairs]
          )}
          onChange={(e: OptionType) => {
            setFeed(e?.value);
            setIsRandom(false);
          }}
          components={{
            IndicatorSeparator: () => null,
          }}
        />

        <Space>
          <Switch
            disabled={viewOnly}
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

      <Flex style={{ paddingTop: '2rem' }} justify="flex-end">
        <Button
          type="primary"
          loading={isUpdating}
          onClick={onUpdateHandler}
          disabled={subscription.owner !== address?.toLowerCase()}
        >
          Update
        </Button>
      </Flex>
    </Flex>
  );
};
