import React, { useState } from 'react';
import { Col, Row, Radio, Switch, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';

import { usePythiaData } from 'Providers/PythiaData';
import { useSubscriptionsFilters } from 'Providers/SubscriptionsFilters';
import { mapChainsToOptions } from '../../../utils/helper';
import { SecondaryButton } from 'Components/SecondaryButton';
import styles from './FiltersBar.scss';
import { MultiSelect } from 'Components/Select';

const FiltersBar = () => {
  const { chains } = usePythiaData();

  const {
    showMine,
    filterByType,
    setShowMine,
    setFilterByType,
    setChainIds,
    debouncedChangeHandler,
  } = useSubscriptionsFilters();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchVisible, setSearchIsVisible] = useState(false);

  const onChainSelect = (val) => {
    setChainIds(val?.map((s) => s.value) ?? []);
  };

  const onChangeType = (e) => {
    setFilterByType(e.target.value);
    searchParams.set('type', e.target.value);
    setSearchParams(searchParams);
  };

  return (
    <Row flex={1} gutter={[16]} justify="center" align="middle" className={styles.container}>
      <Col>
        <Radio.Group
          value={filterByType}
          onChange={onChangeType}
          defaultValue="Price"
          size="large"
          options={[
            { label: 'All', value: 'all' },
            { label: 'Price', value: 'price' },
            { label: 'Random', value: 'random' },
          ]}
          optionType="button"
        ></Radio.Group>
      </Col>
      <Col>
        <Switch
          size="large"
          checked={showMine}
          onChange={() => {
            setShowMine(!showMine);
            searchParams.set('showMine', !showMine);
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
      <Col>
        {isSearchVisible && (
          <Input
            size="large"
            placeholder="Search..."
            onChange={debouncedChangeHandler}
            style={{ width: 200, maxHeight: '38px' }}
            allowClear
            prefix={<SearchOutlined style={{ color: '#1D2E51' }} />}
          />
        )}
        <SecondaryButton
          icon={<SearchOutlined />}
          size="large"
          onClick={() => setSearchIsVisible(!isSearchVisible)}
        />
      </Col>
    </Row>
  );
};

export default FiltersBar;
