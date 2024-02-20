import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Input, Flex, Space, Switch, Card, Tooltip } from 'antd';

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
import { MAX_API_KEYS, MAX_SOURCES, MIN_BALANCE } from 'Constants/ui';
import { Source } from 'Interfaces/feed';
import { useGetSybilFeeds } from 'ApiHooks/useGetSybilFeeds';
import { validateUrlKeys } from 'Utils/validateURLKeys';

const TREASURER_CHAIN = CHAINS_MAP[42161];
const USDT_TOKEN_POLYGON = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
const USDT_TOKEN_POLYGON_DECIMALS = 6;

export const NewFeed = (params: any) => {
  const isViewingMode = Boolean(params.feedId);

  const newSource: Source = {
    uri: '',
    resolver: '',
    expected_bytes: [],
    api_keys: [],
  };

  const convertedFrequency = Number(params.frequency) / 60;
  const [feedId, setFeedId] = useState<string>(params.feedId ?? '');
  const [frequency, setFrequency] = useState<string>(
    params.frequency ? convertedFrequency.toString() : ''
  );
  const [sources, setSources] = useState<Source[]>(params.sources ?? [newSource]);
  const [isCreating, setIsCreating] = useState(false);
  const [isPriceFeed, setIsPriceFeed] = useState(Boolean(params.decimals) ?? false);
  const [decimals, setDecimals] = useState(params.decimals ?? '9');
  const [balance, setBalance] = useState(0);

  const newKey = (index: number) => ({
    title: index === 0 ? 'key' : `key${index}`,
    key: '',
  });

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

  const addKey = (index: number) => {
    const newSources = [...sources];
    newSources[index].api_keys.push(newKey(newSources[index].api_keys.length));
    setSources(newSources);
  };

  console.log(sources);

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
          // @ts-ignore
          sources: sources.map((item) => ({
            ...item,
            uri: item.uri.trim(),
            resolver: item.resolver.trim(),
            api_keys: [item.api_keys],
          })),
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

  const isFeedIdValid =
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
        <Switch
          checked={isPriceFeed}
          onChange={(checked: boolean) => setIsPriceFeed(checked)}
          disabled={isViewingMode}
        />
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
            <Tooltip
              trigger={['focus']}
              title={
                source.uri && source.uri.includes('key') ? 'URI should contain all keys' : null
              }
              placement="topLeft"
            >
              <Input
                disabled={isViewingMode}
                value={source.uri}
                placeholder="URI"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateSource(index, { ...source, uri: e.target.value })
                }
                status={
                  source.uri ? (validateUrlKeys(source.uri, source.api_keys) ? '' : 'error') : ''
                }
              />
            </Tooltip>
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

          {(params.sources ? source.api_keys[0] : source.api_keys).map((key, idx) => (
            <Card
              key={idx}
              size="small"
              title={idx > 1 ? 'Key ' + (idx + 1) : 'Key'}
              extra={
                <Button
                  type="text"
                  disabled={isViewingMode}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    const newSources = [...sources];
                    newSources[index].api_keys.splice(idx, 1);
                    setSources(newSources);
                  }}
                />
              }
            >
              <Space size="middle" direction="vertical" style={{ width: '100%', paddingTop: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div className={styles.label}>Title</div>
                  <Input
                    disabled={true}
                    value={key.title}
                    placeholder="Title"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateSource(index, {
                        ...source,
                        api_keys: source.api_keys.map((k, i) =>
                          i === idx ? { ...k, title: e.target.value } : k
                        ),
                      })
                    }
                  />
                </Space>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div className={styles.label}>Code</div>
                  <Input.Password
                    disabled={isViewingMode}
                    value={key.key}
                    placeholder="Code"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateSource(index, {
                        ...source,
                        api_keys: source.api_keys.map((k, i) =>
                          i === idx ? { ...k, key: e.target.value } : k
                        ),
                      })
                    }
                  />
                </Space>
              </Space>
            </Card>
          ))}

          {source.api_keys.length !== MAX_API_KEYS && !isViewingMode && (
            <Button
              disabled={isViewingMode}
              style={{ alignSelf: 'flex-end' }}
              icon={<PlusCircleOutlined />}
              onClick={() => addKey(index)}
              type="text"
            >
              Add key
            </Button>
          )}
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
            {!isViewingMode && (
              <Button
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
              </Button>
            )}
          </Flex>
        </Space>
      ) : (
        <SignInButton chain={currentChain} style={{ alignSelf: 'flex-end' }} />
      )}
    </Flex>
  );
};
