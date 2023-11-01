import React from 'react';
import { Col, Row, Radio, Switch } from 'antd';
import { useSearchParams } from 'react-router-dom';

import { usePythiaData } from 'Providers/PythiaData';
import { useSubscriptionsFilters } from 'Providers/SubscriptionsFilters';
import { mapChainsToOptions } from '../helper';

import styles from './FiltersBar.scss';
import { MultiSelect } from 'Components/Select';

const FiltersBar = () => {
  const { chains } = usePythiaData();

  const {
    showAll,
    showPair,
    chainIds,
    showRandom,
    setShowAll,
    setShowPair,
    setShowRandom,

    setChainIds,
  } = useSubscriptionsFilters();

  const [searchParams, setSearchParams] = useSearchParams();

  const onChainSelect = (val) => {
    setChainIds(val?.map((s) => s.value) ?? []);
  };

  const onChangeType = (e) => {
    //TODO: add and remove params when filters are changed
    if (e.target.value === 'price') {
      setShowPair(true);
      setShowRandom(false);
      searchParams.set('showPair', true);
      setSearchParams(searchParams);
    }
    if (e.target.value === 'random') {
      setShowRandom(true);
      setShowPair(false);
      searchParams.set('showRandom', true);
      setSearchParams(searchParams);
    }
  };

  return (
    <Row gutter={[16]} align="middle" className={styles.container}>
      <Col>
        <Radio.Group
          onChange={onChangeType}
          defaultValue="Price"
          size="large"
          options={[
            { label: 'Price', value: 'price' },
            { label: 'Random', value: 'random' },
            // { label: 'Custom', value: 'custom' },
          ]}
          optionType="button"
        ></Radio.Group>
      </Col>
      <Col>
        <Switch
          size="large"
          checked={!showAll}
          onChange={() => {
            setShowAll(!showAll);
            searchParams.set('showAll', !showAll);
            setSearchParams(searchParams);
          }}
          style={{ marginRight: 10 }}
        />
        Mine
      </Col>
      <Col>
        <MultiSelect
          className={styles.chainSelect}
          classNamePrefix="react-select"
          styles={{
            multiValue: (base) => ({
              ...base,
              backgroundColor: '#070E1B',
              borderRadius: '50%',
              padding: '2px',
            }),
          }}
          options={mapChainsToOptions(chains)}
          onChange={onChainSelect}
          maxWidth={160}
        />
      </Col>
    </Row>
  );
};

export default FiltersBar;
