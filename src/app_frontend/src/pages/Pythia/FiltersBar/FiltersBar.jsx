import React from 'react';
import { Col, Row, Radio } from 'antd';
import Select from 'react-select';
import Button from 'Components/Button';
import { useSearchParams } from 'react-router-dom';

import { usePythiaData } from 'Providers/PythiaData';
import { useSubscriptionsFilters } from 'Providers/SubscriptionsFilters';
import { SingleValue, Option } from '../Subscription/NewSubscription';
import { mapChainsToOptions } from '../helper';

import styles from './FiltersBar.scss';

const FiltersBar = () => {
  const { chains } = usePythiaData();

  const {
    showAll,
    showPair,
    chainId,
    showInactive,
    showRandom,
    setShowAll,
    setShowPair,
    setShowRandom,
    setShowInactive,
    setChainId,
  } = useSubscriptionsFilters();

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Row gutter={[16]} align="center" className={styles.container}>
      <Col>
        <Radio.Group
          defaultValue="Price"
          size="large"
          options={[
            { label: 'Price', value: 'price' },
            { label: 'Random', value: 'random' },
            { label: 'Custom', value: 'custom' },
          ]}
          optionType="button"
        ></Radio.Group>
      </Col>
      <Col>
        <Button
          size="large"
          type="default"
          onClick={() => {
            setShowAll(!showAll);
            setSearchParams({ showAll: !showAll });
          }}
        >
          {showAll ? 'Mine' : 'All'}
        </Button>
      </Col>
      <Col>
        <Select
          isClearable
          setValue={setChainId}
          value={chainId ? { label: chainId, value: chainId } : null}
          className={styles.chainSelect}
          classNamePrefix="react-select"
          styles={{
            singleValue: (base) => ({
              ...base,
              borderRadius: 5,
              display: 'flex',
            }),
          }}
          components={{ SingleValue, Option }}
          options={mapChainsToOptions(chains)}
          onChange={(e) => setChainId(e && e.value ? e.value : null)}
        />
      </Col>
    </Row>
  );
};

export default FiltersBar;
