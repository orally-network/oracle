import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Input, Flex, Space, Switch } from 'antd';
import sizeof from 'object-sizeof';

import { CHAINS_MAP } from 'Constants/chains';
import Button from 'Components/Button';
import logger from 'Utils/logger';

import styles from './NewFeed.scss';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useGlobalState } from 'Providers/GlobalState';
import { useBalance, useNetwork, usePrepareContractWrite, useSendTransaction } from 'wagmi';
import sybilCanister from 'Canisters/sybilCanister';
import { remove0x } from 'Utils/addressUtils';
import { SignInButton } from 'Shared/SignInButton';
import { utils } from 'ethers';
import { DEFAULT_TOP_UP_AMOUNT, MIN_BALANCE } from 'Constants/ui';
import { waitForTransaction, writeContract } from '@wagmi/core';
import { usePythiaData } from 'Providers/PythiaData';
import { GeneralResponse } from 'Interfaces/common';
import { abi } from './abi';
import { useConfig } from 'wagmi';
import Control from 'Shared/Control';

const TREASURER_CHAIN = CHAINS_MAP[42161];
const USDT_TOKEN_POLYGON = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
const USDT_TOKEN_POLYGON_DECIMALS = 6;

interface Source {
  uri: string;
  resolver: string;
  expected_bytes: number;
}

interface NewFeedProps {}

export const NewFeed = ({}: NewFeedProps) => {
  const newSource: Source = {
    uri: '',
    resolver: '',
    expected_bytes: 0,
  };

  const [feedId, setFeedId] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');
  const [sources, setSources] = useState<Source[]>([newSource]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSourcesTested, setIsSourcesTested] = useState(false);
  const [isPriceFeed, setIsPriceFeed] = useState(false);
  const [decimals, setDecimals] = useState('9');
  const [balance, setBalance] = useState(0);

  const { addressData } = useGlobalState();
  const { pma, fetchBalance, isBalanceLoading } = usePythiaData();

  const { chain: currentChain } = useNetwork();

  const refetchBalance = useCallback(async () => {
    setBalance(await fetchBalance(TREASURER_CHAIN.id, addressData.address));
  }, [addressData, fetchBalance]);

  useEffect(() => {
    if (addressData) {
      refetchBalance();
    }
  }, [addressData, refetchBalance]);

  const { data: executionBalance } = useBalance({
    address: pma,
    chainId: TREASURER_CHAIN.id,
    token: USDT_TOKEN_POLYGON,
  });

  console.log({ executionBalance });

  const addSource = () => {
    setSources([...sources, newSource]);
  };

  const updateSource = (index: number, source: Source) => {
    setSources(sources.map((s, i) => (i === index ? source : s)));
  };

  const createFeed = async () => {
    setIsCreating(true);
    toast.info(`Creating...`);

    try {
      const customFeedRes: GeneralResponse = await sybilCanister.create_custom_feed({
        feed_id: feedId.toUpperCase(),
        update_freq: +frequency * 60,
        sources,
        decimals: isPriceFeed ? [Number(decimals)] : [],
        msg: addressData.message,
        sig: remove0x(addressData.signature),
      });

      if (customFeedRes.Err) {
        toast.error(`Create failed. Something went wrong. Try again later.`);
      }

      console.log({ customFeedRes });
      return toast.success('Created successfully');
    } catch (error) {
      logger.error(`Create feed`, error);
      toast.error(`Create failed. Something went wrong. Try again later.`);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const testSources = async () => {
    setIsSourcesTested(true);
    return true;
    setIsCreating(true);

    const sourcesPromises = sources.map((s) => fetch(`https://rpc.orally.network/?rpc=${s.uri}`));

    try {
      const testSourcesRes = await Promise.all(sourcesPromises);
      const bytes = sizeof(testSourcesRes);
      setSources(sources.map((s) => ({ ...s, expected_bytes: bytes })));
      console.log({ testSourcesRes });
    } finally {
      setIsSourcesTested(true);
      setIsCreating(false);
    }
  };

  const regex = new RegExp('^[a-zA-Z]+/[a-zA-Z]+$');

  return (
    <Flex vertical={true} gap="large" style={{ paddingBottom: '60px' }}>
      <Space direction="vertical">
        <div>Feed id</div>
        <div className={styles.label}>.../USD</div>
        <Input
          value={feedId}
          placeholder=".../USD"
          pattern="^[a-zA-Z]+\/[a-zA-Z]+$"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedId(e.target.value.trim())}
          disabled={isSourcesTested}
          status={feedId !== '' ? (regex.test(feedId) ? '' : 'error') : ''}
        />
      </Space>
      <Space direction="vertical">
        <div>Expiration time</div>
        <div className={styles.label}>Frequency (min)</div>
        <Input
          pattern="[0-9]*"
          value={frequency}
          placeholder="Frequency"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFrequency(e.target.value)}
          disabled={isSourcesTested}
        />
      </Space>
      <Space>
        <Switch
          disabled={isSourcesTested}
          checked={isPriceFeed}
          onChange={(checked: boolean) => setIsPriceFeed(checked)}
        />
        Price Feed
      </Space>

      {isPriceFeed && (
        <Space direction="vertical">
          <div>Decimals</div>
          <div className={styles.label}>Add decimals</div>
          <Input
            value={decimals}
            type="number"
            min="0"
            max="19"
            placeholder="decimals from 0 to 19"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDecimals(e.target.value.trim())
            }
            disabled={isSourcesTested}
          />
        </Space>
      )}

      {sources.map((source, index) => (
        <Space key={index} size="middle" direction="vertical">
          <Flex justify="space-between">
            <div>Source #{index + 1}</div>
            {sources.length !== 1 && !isSourcesTested && (
              <Button
                icon={<DeleteOutlined />}
                onClick={() => {
                  const newSources = [...sources];
                  newSources.splice(index, 1);
                  setSources(newSources);
                }}
              />
            )}
          </Flex>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className={styles.label}>URI</div>
            <Input
              value={source.uri}
              placeholder="URI"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSource(index, { ...source, uri: e.target.value })
              }
              disabled={isSourcesTested}
            />
          </Space>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className={styles.label}>Resolver</div>
            <Input
              value={source.resolver}
              placeholder="Resolver"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSource(index, { ...source, resolver: e.target.value })
              }
              disabled={isSourcesTested}
            />
          </Space>
        </Space>
      ))}

      {sources.length !== 10 && !isSourcesTested && (
        <Button style={{ alignSelf: 'flex-end' }} icon={<PlusCircleOutlined />} onClick={addSource}>
          Add source
        </Button>
      )}

      {isSourcesTested ? (
        <Space direction="vertical" size="middle">
          <Control
            addressData={addressData}
            balance={balance}
            executionAddress={pma}
            refetchBalance={refetchBalance}
            isBalanceLoading={isBalanceLoading}
            chain={TREASURER_CHAIN}
          />

          <Button
            disabled={
              !feedId || !frequency || !sources.length || isCreating || balance < MIN_BALANCE
            }
            onClick={createFeed}
            type="primary"
            style={{ alignSelf: 'flex-end' }}
            loading={isCreating}
          >
            Create
          </Button>
        </Space>
      ) : addressData && addressData.address ? (
        <Button
          disabled={!feedId || !frequency || !sources.every((s) => s.resolver && s.uri)}
          onClick={testSources}
          type="primary"
          style={{ alignSelf: 'flex-end' }}
          loading={isCreating}
        >
          Test fetch
        </Button>
      ) : (
        <SignInButton chain={currentChain} style={{ alignSelf: 'flex-end' }} />
      )}
    </Flex>
  );
};
