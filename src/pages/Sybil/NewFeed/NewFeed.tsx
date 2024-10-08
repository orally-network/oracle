import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Input, Flex, Space, Switch, Card, Tooltip } from 'antd';

import Button from 'Components/Button';
import { SybilBalance } from 'Shared/SybilBalance';
import { SybilTopUp } from 'Shared/SybilTopUp';
import logger from 'Utils/logger';

import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useGlobalState } from 'Providers/GlobalState';
import { remove0x } from 'Utils/addressUtils';
import { SignInButton } from 'Shared/SignInButton';
import { useSybilData } from 'Providers/SybilPairs';
import { useFetchBalance } from 'Services/sybilService';
import { MAX_API_KEYS, MAX_SOURCES, MIN_BALANCE } from 'Constants/ui';
import { Source } from 'Interfaces/feed';
import { useGetSybilFeeds } from 'ApiHooks/useGetSybilFeeds';
import { validateUrlKeys } from 'Utils/validateURLKeys';

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
    params.frequency ? convertedFrequency.toString() : '',
  );
  const [sources, setSources] = useState<Source[]>(params.sources ?? [newSource]);
  const [isCreating, setIsCreating] = useState(false);
  const [isPriceFeed, setIsPriceFeed] = useState(Boolean(params.decimals) ?? false);
  const [decimals, setDecimals] = useState(params.decimals ?? '9');
  const { data: balance } = useFetchBalance();

  const newKey = (index: number) => ({
    title: index === 0 ? 'key' : `key${index + 1}`,
    key: '',
  });

  const { addressData } = useGlobalState();
  const { createFeed } = useSybilData();
  const feeds = useGetSybilFeeds({ isGetAll: true });

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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          sources: sources.map((item) => ({
            HttpSource: {
              ...item,
              uri: item.uri.trim(),
              resolver: item.resolver.trim(),
              api_keys: [item.api_keys],
            },
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
        },
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
        <div className="text-secondary-button">.../USD</div>
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
        <div className="text-secondary-button">Frequency (min)</div>
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
          <div className="text-secondary-button">Add decimals</div>
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
            <div className="text-secondary-button">URI</div>
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
            <div className="text-secondary-button">Resolver</div>
            <Input
              disabled={isViewingMode}
              value={source.resolver}
              placeholder="Resolver"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateSource(index, { ...source, resolver: e.target.value })
              }
            />
          </Space>

          {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-expect-error */}
          {(params.sources && source.api_keys.length ? source.api_keys[0] : source.api_keys).map(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            (key, idx) => (
              <Card
                key={idx}
                size="small"
                title={idx === 0 ? 'Key' : `Key ${idx + 1}`}
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
                    <div className="text-secondary-button">Title</div>
                    <Input
                      disabled={true}
                      value={key.title}
                      placeholder="Title"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateSource(index, {
                          ...source,
                          api_keys: source.api_keys.map((k, i) =>
                            i === idx ? { ...k, title: e.target.value } : k,
                          ),
                        })
                      }
                    />
                  </Space>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div className="text-secondary-button">Code</div>
                    <Input.Password
                      disabled={isViewingMode}
                      value={key.key}
                      placeholder="Code"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateSource(index, {
                          ...source,
                          api_keys: source.api_keys.map((k, i) =>
                            i === idx ? { ...k, key: e.target.value } : k,
                          ),
                        })
                      }
                    />
                  </Space>
                </Space>
              </Card>
            ),
          )}

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
          <SybilBalance />
          <SybilTopUp />

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
        <SignInButton style={{ alignSelf: 'flex-end' }} />
      )}
    </Flex>
  );
};
