import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Input, Flex, Space, Switch } from 'antd';
import sizeof from 'object-sizeof';

import { CHAINS_MAP } from 'Constants/chains';
import Button from 'Components/Button';
import logger from 'Utils/logger';

import styles from './NewFeed.scss';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useGlobalState } from 'Providers/GlobalState';
import { useBalance } from 'wagmi';
import sybilCanister from 'Canisters/sybilCanister';
import { remove0x } from 'Utils/addressUtils';

const TREASURER_CHAIN = CHAINS_MAP[137];
const USDT_TOKEN_POLYGON = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';

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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isSourcesTested, setIsSourcesTested] = useState(false);
  const [isPriceFeed, setIsPriceFeed] = useState(false);
  const [decimals, setDecimals] = useState('9');

  const { addressData } = useGlobalState();

  const { data: executionBalance } = useBalance({
    address: addressData?.executionAddress,
    chainId: TREASURER_CHAIN.id,
    token: USDT_TOKEN_POLYGON,
  });

  console.log({ executionBalance }, 'executionBalance');

  const addSource = () => {
    setSources([...sources, newSource]);
  };

  const updateSource = (index: number, source: Source) => {
    setSources(sources.map((s, i) => (i === index ? source : s)));
  };

  const createFeed = async () => {
    setConfirmLoading(true);

    try {
      const amount = Number(executionBalance?.formatted);
      console.log({ amount });

      // const depositResult = await toast.promise(
      //   sybilCanister.deposit({
      //     amount,
      //     taxpayer: addressData?.address,
      //     deposit_type: {
      //       Erc20: null,
      //     },
      //   }),
      //   {
      //     pending: `Depositing...`,
      //     success: `Deposited successfully`,
      //     error: {
      //       render({ error }) {
      //         logger.error(`Deposit`, error);

      //         return 'Something went wrong. Try again later.';
      //       },
      //     },
      //   }
      // );

      // console.log({ depositResult });

      const customFeedRes = await toast.promise(
        sybilCanister.create_custom_feed({
          feed_id: feedId,
          update_freq: +frequency * 60,
          sources,
          decimals: isPriceFeed ? Number(decimals) : 0,
          msg: addressData.message,
          sig: remove0x(addressData.signature),
        }),
        {
          pending: `Creating...`,
          success: `Created successfully`,
          error: {
            render({ error }) {
              logger.error(`Create`, error);

              return 'Something went wrong. Try again later.';
            },
          },
        }
      );

      console.log({ customFeedRes });
    } finally {
      setConfirmLoading(false);
    }
  };

  const testSources = async () => {
    setConfirmLoading(true);

    const sourcesPromises = sources.map((s) => fetch(`https://rpc.orally.network/?rpc=${s.uri}`));

    try {
      const testSourcesRes = await Promise.all(sourcesPromises);
      const bytes = sizeof(testSourcesRes);
      console.log({ bytes });
      console.log({ testSourcesRes });
    } finally {
      setIsSourcesTested(true);
      setConfirmLoading(false);
    }
  };

  return (
    <Flex vertical={true} gap="large" style={{ paddingBottom: '40px' }}>
      <Space direction="vertical">
        <div>Feed id</div>
        <div className={styles.label}>.../USD</div>
        <Input
          value={feedId}
          placeholder=".../USD"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedId(e.target.value.trim())}
          disabled={isSourcesTested}
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
          onChange={(checked: boolean) => {
            {
              setIsPriceFeed(checked);
              // setFeed(null);
            }
          }}
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
        <Button
          disabled={!feedId || !frequency || !sources.length || confirmLoading}
          onClick={createFeed}
          type="primary"
          style={{ alignSelf: 'flex-end' }}
          loading={confirmLoading}
        >
          Create
        </Button>
      ) : (
        <Button
          disabled={
            !feedId || !frequency || !sources.every((s) => s.resolver && s.uri) || confirmLoading
          }
          onClick={testSources}
          type="primary"
          style={{ alignSelf: 'flex-end' }}
          loading={confirmLoading}
        >
          Test fetch
        </Button>
      )}
    </Flex>
  );
};
