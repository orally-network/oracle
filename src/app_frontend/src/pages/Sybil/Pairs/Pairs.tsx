import React, { useState, useMemo, useEffect } from 'react';
import { Card, Space, Flex } from 'antd';
import cn from 'classnames';
import { CopyBlock, atomOneDark } from 'react-code-blocks';

import config from 'Constants/config';
import { useSybilPairs } from 'Providers/SybilPairs';

import styles from './Pairs.scss';
import { Pair } from 'Interfaces/pair';
import Loader from 'Components/Loader';

const MILLI = Math.pow(10, 3);

const getCodeText = (selectedPair: Pair) => {
  const url = `http${config.isDevelopment ? '' : 's'}://${config.sybil_canister_id}.${
    config.DOMAIN
  }/get_asset_data_with_proof?pair_id=${selectedPair?.id ?? '{pair_id}'}`;

  return ` // fetch price feed
  const url = '${url}';
  const response = await fetch(url);

  // response example:
  {
    "symbol": "${selectedPair?.id ?? 'string'}",
    "rate": ${selectedPair?.data?.[0]?.rate ?? 'number'},
    "timestamp": ${selectedPair?.data?.[0]?.timestamp ?? 'number'}, // ${new Date(
      Number(selectedPair?.data?.[0]?.timestamp) * MILLI
    ).toGMTString()}
    "decimals": ${selectedPair?.data?.[0]?.decimals ?? 'number'}
    "signature": "${selectedPair?.data?.[0]?.signature ?? 'string'}"
  }
  `;
};

const Pairs = () => {
  const { pairs, isLoading } = useSybilPairs();
  const [selectedPair, setSelectedPair] = useState<Pair | null>(null);

  useEffect(() => {
    if (pairs.length > 0) {
      setSelectedPair(pairs[0]);
    }
  }, [pairs]);

  const codeText = useMemo(() => {
    if (selectedPair !== null) {
      return getCodeText(selectedPair);
    }
    return '';
  }, [selectedPair]);

  const handlePairClick = (pair: Pair) => {
    setSelectedPair(pair);
  };

  return (
    <Flex justify="center">
      {isLoading ? (
        <Loader size="large" />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Space wrap>
            {pairs.map((pair: Pair) => (
              <Card
                className={cn([styles.pair, pair.id === selectedPair?.id && styles.selected])}
                key={pair.id}
                onClick={() => handlePairClick(pair)}
              >
                {pair.id}
              </Card>
            ))}
          </Space>

          <div className={styles.pairDetails}>
            <CopyBlock text={codeText} language={'typescript'} theme={atomOneDark} />
          </div>
        </Space>
      )}
    </Flex>
  );
};

export default Pairs;
