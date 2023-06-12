import React, { useState, useCallback } from 'react';
import { Space, Modal, Input } from 'antd';
import { useBalance } from 'wagmi';
import { toast } from 'react-toastify';

import Button from 'Components/Button';
import useSignature from 'Shared/useSignature';
import { useGlobalState } from 'Providers/GlobalState';
import { CHAINS_MAP } from 'Constants/chains';
import Control from 'Shared/Control';
import treasurerCanister from 'Canisters/treasurerCanister';
import sybilCanister from 'Canisters/sybilCanister';
import logger from 'Utils/logger';
import { remove0x } from 'Utils/addressUtils';

import styles from './CustomPair.scss';

const TREASURER_CHAIN = CHAINS_MAP[59140];
const USDT_TOKEN_LINEA = '0xf56dc6695cf1f5c364edebc7dc7077ac9b586068';

const CustomPair = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  
  const [symbol, setSymbol] = useState('');
  const [frequency, setFrequency] = useState(30); // mins
  const [uri, setUri] = useState('');
  const [resolver, setResolver] = useState('');
  
  const { signMessage } = useSignature({ canister: 'sybil' });
  const { addressData } = useGlobalState();

  const { data: executionBalance } = useBalance({
    address: addressData?.executionAddress,
    chainId: TREASURER_CHAIN.id,
    token: USDT_TOKEN_LINEA,
  });

  const createCustomPair = useCallback(async () => {
    setConfirmLoading(true);
    
    try {
      const amount = Number(executionBalance?.formatted);
      console.log({ amount });

      const depositResult = await toast.promise(
        treasurerCanister.deposit({
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
            render({error}) {
              logger.error(`Deposit`, error);

              return 'Something went wrong. Try again later.';
            }
          },
        }
      );

      console.log({depositResult});

      // pair_id : text;
      // frequency : nat;
      // uri : text;
      // resolver : text;
      // amount : nat;
      // msg : text;
      // sig : text;

      const customPairRes = await toast.promise(
        sybilCanister.create_custom_pair({
          pair_id: symbol,
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
            render({error}) {
              logger.error(`Deposit`, error);

              return 'Something went wrong. Try again later.';
            }
          },
        }
      );

      console.log({customPairRes});
    } finally {
      setIsModalVisible(false);
      setConfirmLoading(false);
    }
  }, [executionBalance, addressData, symbol, frequency, uri, resolver]);
  
  const nextHandler = useCallback(() => setIsEdit(!isEdit), [isEdit]);

  return (
    <Space className={styles.customPair}>
      <Button
        disabled
        type="primary"
        onClick={() => setIsModalVisible(true)}
      >
        Create custom pair
      </Button>
      
      <Modal
        title="Create custom pair"
        open={isModalVisible}
        onOk={createCustomPair}
        confirmLoading={confirmLoading}
        onCancel={() => setIsModalVisible(false)}
        className={styles.modal}
      >
        <Space className={styles.content}>
          <div className={styles.inputs}>
            <div className={styles.stat}>
              <div className={styles.label}>
                Symbol
              </div>

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

            <div className={styles.stat}>
              <div className={styles.label}>
                URI
              </div>

              <div className={styles.val}>
                <Input
                  disabled={!isEdit}
                  className={styles.input}
                  value={uri}
                  placeholder="https://endpoint.dev?symbol={symbol}"
                  onChange={useCallback((e) => setUri(e.target.value), [])}
                />
              </div>
            </div>

            <div className={styles.stat}>
              <div className={styles.label}>
                Resolver
              </div>

              <div className={styles.val}>
                <Input
                  disabled={!isEdit}
                  className={styles.input}
                  value={resolver}
                  placeholder="/data/0/rate"
                  onChange={useCallback((e) => setResolver(e.target.value), [])}
                />
              </div>
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
              disabled={!symbol || !frequency || !uri || !resolver}
              signMessage={signMessage}
              addressData={addressData}
              chain={TREASURER_CHAIN}
              token={USDT_TOKEN_LINEA}
            />
          )}
        </Space>
      </Modal>
    </Space>
  )
};

export default CustomPair;
