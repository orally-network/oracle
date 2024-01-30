import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Input, Flex, Space, Switch } from 'antd';

import { CHAINS_MAP } from 'Constants/chains';
import Button from 'Components/Button';
import logger from 'Utils/logger';

import styles from './NewFeed.scss';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useGlobalState } from 'Providers/GlobalState';
import { useBalance, useNetwork } from 'wagmi';
import { remove0x } from 'Utils/addressUtils';
import { SignInButton } from 'Shared/SignInButton';
import { usePythiaData } from 'Providers/PythiaData';
import Control from 'Shared/Control';
import { useSybilData } from 'Providers/SybilPairs';
import { MAX_SOURCES, MIN_BALANCE } from 'Constants/ui';
import { Source } from 'Interfaces/feed';
import { useGetSybilFeeds } from 'ApiHooks/useGetSybilFeeds';

const TREASURER_CHAIN = CHAINS_MAP[42161];
const USDT_TOKEN_POLYGON = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
const USDT_TOKEN_POLYGON_DECIMALS = 6;

export const NewFeed = (params) => {
  const isViewingMode = Boolean(params.feedId);

  const newSource: Source = {
    uri: '',
    resolver: '',
    expected_bytes: [],
  };

  const [feedId, setFeedId] = useState<string>(params.feedId ?? '');
  const [frequency, setFrequency] = useState<string>(params.frequency ?? '');
  const [sources, setSources] = useState<Source[]>(params.sources ?? [newSource]);
  const [isCreating, setIsCreating] = useState(false);
  const [isPriceFeed, setIsPriceFeed] = useState(Boolean(params.decimals) ?? false);
  const [decimals, setDecimals] = useState(params.decimals ?? '9');
  const [balance, setBalance] = useState(0);

  const { addressData } = useGlobalState();
  const { pma } = usePythiaData();
  const { fetchBalance, isBalanceLoading, createFeed } = useSybilData();
  const feeds = useGetSybilFeeds({ isGetAll: true });

  const { chain: currentChain } = useNetwork();

  const refetchBalance = async () => {
    const balanceResponse = await fetchBalance(addressData);
    setBalance(balanceResponse);
  };

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

  const create = async () => {
    setIsCreating(true);

    try {
      await toast.promise(
        createFeed({
          id: feedId.toUpperCase(),
          feed_type: {
            Custom: null,
          },
          update_freq: +frequency * 60,
          sources,
          decimals: isPriceFeed ? [Number(decimals)] : [],
          msg: addressData.message,
          sig: remove0x(addressData.signature),
        }),
        {
          pending: `Creating...`,
          success: `Created successfully`,
          error: {
            render({ data }) {
              logger.error('Create failed', data);
              return `Create failed. ${data} Try again later.`;
            },
          },
        }
      );
    } catch (error) {
      logger.error(`Create feed`, error);
    } finally {
      setIsCreating(false);
    }
  };

  const regex = new RegExp('^[a-zA-Z]+/[a-zA-Z0-9]+$');

  const isFeedIdValid =
    regex.test(feedId) &&
    feeds &&
    feeds.data &&
    feeds.data.items &&
    !feeds.data.items?.some((feed) => feed.id === feedId.toUpperCase());

  return (
    <Flex vertical={true} gap="large" style={{ paddingBottom: '60px' }}>
      <Space direction="vertical">
        <div>Feed id</div>
        <div className={styles.label}>.../USD</div>
        <Input
          disabled={isViewingMode}
          value={feedId}
          placeholder=".../USD"
          pattern="^[a-zA-Z]+\/[a-zA-Z]+$"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedId(e.target.value.trim())}
          status={feedId !== '' ? (isFeedIdValid ? '' : 'error') : ''}
        />
      </Space>
      <Space direction="vertical">
        <div>Expiration time</div>
        <div className={styles.label}>Frequency (min)</div>
        <Input
          disabled={isViewingMode}
          pattern="[0-9]*"
          value={frequency}
          placeholder="Frequency"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFrequency(e.target.value)}
        />
      </Space>
      <Space>
        <Switch checked={isPriceFeed} onChange={(checked: boolean) => setIsPriceFeed(checked)} disabled={isViewingMode} />
        Price Feed
      </Space>

      {isPriceFeed && (
        <Space direction="vertical">
          <div>Decimals</div>
          <div className={styles.label}>Add decimals</div>
          <Input
            disabled={isViewingMode}
            value={decimals}
            type="number"
            min="0"
            max="19"
            placeholder="decimals from 0 to 19"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDecimals(e.target.value.trim())
            }
          />
        </Space>
      )}

      {sources.map((source, index) => (
        <Space key={index} size="middle" direction="vertical">
          <Flex justify="space-between">
            <div>Source #{index + 1}</div>
            {sources.length !== 1 && (
              <Button
                disabled={isViewingMode}
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
              disabled={isViewingMode}
              value={source.uri}
              placeholder="URI"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSource(index, { ...source, uri: e.target.value })
              }
            />
          </Space>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className={styles.label}>Resolver</div>
            <Input
              disabled={isViewingMode}
              value={source.resolver}
              placeholder="Resolver"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSource(index, { ...source, resolver: e.target.value })
              }
            />
          </Space>
        </Space>
      ))}
      {sources.length !== MAX_SOURCES && !isViewingMode && (
        <Button
          disabled={isViewingMode}
          style={{ alignSelf: 'flex-end' }}
          icon={<PlusCircleOutlined />}
          onClick={addSource}
        >
          Add source
        </Button>
      )}

      {addressData && addressData.address ? (
        <Space direction="vertical" size="middle">
          <Control
            addressData={addressData}
            balance={balance}
            executionAddress={pma}
            refetchBalance={refetchBalance}
            isBalanceLoading={isBalanceLoading}
            chain={TREASURER_CHAIN}
            decimals={USDT_TOKEN_POLYGON_DECIMALS}
            symbol="USDC"
            isPythia={false}
          />
          <Flex justify="flex-end">
            {!isViewingMode && <Button
              disabled={
                isViewingMode ||
                !feedId ||
                !frequency ||
                !sources.length ||
                !sources.every((s) => s.uri && s.resolver) ||
                isCreating ||
                balance === undefined ||
                balance < MIN_BALANCE ||
                !isFeedIdValid
              }
              onClick={create}
              type="primary"
              loading={isCreating}
            >
              Create
            </Button>}
          </Flex>
        </Space>
      ) : (
        <SignInButton chain={currentChain} style={{ alignSelf: 'flex-end' }} />
      )}
    </Flex>
  );
};