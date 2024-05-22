import React, { useState, useCallback } from 'react';
import { Space, Modal, Input } from 'antd';
import { useBalance } from 'wagmi';
import { toast } from 'react-toastify';
import jsonSize from 'json-size';

import Button from 'Components/Button';
import useSignature from 'Shared/useSignature';
import { useGlobalState } from 'Providers/GlobalState';
import { CHAINS_MAP } from 'Constants/chains';
import Control from 'Shared/Control';
import sybilCanister from 'Canisters/sybilCanister';
import logger from 'Utils/logger';
import { remove0x } from 'Utils/addressUtils';

import styles from './CustomFeed.scss';

const TREASURER_CHAIN = CHAINS_MAP[137];
const USDT_TOKEN_POLYGON = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';

const CustomFeed = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(true);

  const [symbol, setSymbol] = useState('');
  const [frequency, setFrequency] = useState(30); // mins

  // source: { uri: text; resolver: text; bytes_amount: number; }
  const [sources, setSources] = useState([
    { uri: '', resolver: '', bytes_amount: 0, locked: false, isLoading: false, isInvalid: false },
  ]);
  const [uri, setUri] = useState('');
  const [resolver, setResolver] = useState('');

  const { signMessage } = useSignature({ canister: 'sybil' });
  const { addressData } = useGlobalState();

  const { data: executionBalance } = useBalance({
    address: addressData?.executionAddress,
    chainId: TREASURER_CHAIN.id,
    token: USDT_TOKEN_POLYGON,
  });

  const createCustomFeed = useCallback(async () => {
    setConfirmLoading(true);

    try {
      const amount = Number(executionBalance?.formatted);
      console.log({ amount });

      const depositResult = await toast.promise(
        sybilCanister.deposit({
          amount,
          taxpayer: addressData?.address,
          deposit_type: {
            Erc20: null,
          },
        }),
        {
          pending: `Depositing...`,
          success: `Deposited successfully`,
          error: {
            render({ error }) {
              logger.error(`Deposit`, error);

              return 'Something went wrong. Try again later.';
            },
          },
        }
      );

      console.log({ depositResult });

      const customFeedRes = await toast.promise(
        sybilCanister.create_custom_feed({
          feed_id: symbol,
          frequency,
          uri,
          resolver,
          amount,
          msg: addressData.message,
          sig: remove0x(addressData.signature),
        }),
        {
          pending: `Depositing...`,
          success: `Deposited successfully`,
          error: {
            render({ error }) {
              logger.error(`Deposit`, error);

              return 'Something went wrong. Try again later.';
            },
          },
        }
      );

      console.log({ customFeedRes });
    } finally {
      setIsModalVisible(false);
      setConfirmLoading(false);
    }
  }, [executionBalance, addressData, symbol, frequency, uri, resolver]);

  const nextHandler = useCallback(() => setIsEdit(!isEdit), [isEdit]);

  const closeModal = () => setIsModalVisible(false);

  const getMethods = useCallback(
    (index) => {
      // TODO: refactor this useCallback cannot be called inside a callback
      const handleChangeUri = useCallback(
        (e) =>
          setSources(
            sources.map((source, i) => {
              console.log({ source, i, index, sources }, e.target.value);
              if (index === i) return { ...source, uri: e.target.value };
              return source;
            })
          ),
        [sources]
      );

      const handleChangeResolver = useCallback(
        (e) =>
          setSources(
            sources.map((source, i) => {
              if (index === i) return { ...source, resolver: e.target.value };
              return source;
            })
          ),
        [sources]
      );

      const handleSubmitSource = useCallback(async () => {
        setSources(
          sources.map((source, i) => {
            if (index === i) return { ...source, isLoading: true };
            return source;
          })
        );

        try {
          console.log(sources[index].uri);
          const res = await fetch(sources[index].uri);
          const json = await res.json();

          console.log({ json });

          const bytes = jsonSize(json);

          // const bytes = jsonSize({
          //   "symbol": "BTC/USD",
          //   "rate": 30339151529742,
          //   "decimals": 9,
          //   "timestamp": 1689440693,
          //   "signature": "bb85cac6aed9ece09091862517f63d2299568a974942cbcdc2bd15bce1a68de6129b68e2660e8025fba36414d392f338b958cf72bdfe885775e5fdb5edd9295f1b"
          // })

          console.log({ bytes });
        } catch (e) {
          console.error(e);

          setSources(
            sources.map((source, i) => {
              if (index === i) return { ...source, isLoading: false, isInvalid: true };
              return source;
            })
          );
        }
      }, [sources]);

      return {
        handleChangeUri,
        handleChangeResolver,
        handleSubmitSource,
      };
    },
    [sources]
  );

  console.log({ addressData });

  return (
    <Space className={styles.customFeed}>
      <Button
        disabled={addressData?.address !== '0x654DFF41D51c230FA400205A633101C5C1f1969C'}
        type="primary"
        onClick={() => setIsModalVisible(true)}
      >
        Create custom feed
      </Button>

      <Modal
        title="Create custom feed"
        open={isModalVisible}
        confirmLoading={confirmLoading}
        onCancel={closeModal}
        className={styles.modal}
        footer={[
          <Button key="cancel-btn" onClick={closeModal}>
            Cancel
          </Button>,
          <Button key="ok-btn" onClick={createCustomFeed} type="primary">
            OK
          </Button>,
        ]}
      >
        <Space className={styles.content}>
          <div className={styles.inputs}>
            <div className={styles.stat}>
              <div className={styles.label}>Symbol</div>

              <div className={styles.val}>
                <Input
                  disabled={!isEdit}
                  className={styles.input}
                  value={symbol}
                  placeholder=".../USD"
                  onChange={useCallback((e) => setSymbol(e.target.value), [])}
                />
              </div>
            </div>

            <div className={styles.stat}>
              <div className={styles.label}>Frequency</div>

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

            <div className={styles.sources}>
              {sources.map((source, index) => {
                const { handleChangeResolver, handleChangeUri, handleSubmitSource } =
                  getMethods(index);

                return (
                  <div key={index} className={styles.source}>
                    <div className={styles.stat}>
                      <div className={styles.label}>URI</div>

                      <div className={styles.val}>
                        <Input
                          disabled={!isEdit || source.locked}
                          className={styles.input}
                          value={source.uri}
                          placeholder="https://endpoint.dev?symbol={symbol}"
                          onChange={handleChangeUri}
                          addonAfter={
                            <Button onClick={handleSubmitSource.bind(null, source)}>
                              {source.locked ? 'Change' : 'Add'}
                            </Button>
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.stat}>
                      <div className={styles.label}>Resolver</div>

                      <div className={styles.val}>
                        <Input
                          disabled={!isEdit || source.locked}
                          className={styles.input}
                          value={source.resolver}
                          placeholder="/data/0/rate"
                          onChange={handleChangeResolver}
                        />
                      </div>
                    </div>

                    <div className={styles.stat}>
                      <div className={styles.label}>Bytes amount</div>

                      <div className={styles.val}>
                        <Input disabled className={styles.input} value={source.bytes_amount} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {isEdit ? (
            <Button
              disabled={!symbol || !frequency || !uri || !resolver}
              onClick={nextHandler}
              type="primary"
            >
              Next
            </Button>
          ) : (
            <Button className={styles.back} onClick={nextHandler} type="primary">
              Back
            </Button>
          )}

          {!isEdit && (
            <Control
              disabled={!symbol || !frequency || !uri || !resolver}
              addressData={addressData}
              chain={TREASURER_CHAIN}
              token={USDT_TOKEN_POLYGON}
            />
          )}
        </Space>
      </Modal>
    </Space>
  );
};

export default CustomFeed;
