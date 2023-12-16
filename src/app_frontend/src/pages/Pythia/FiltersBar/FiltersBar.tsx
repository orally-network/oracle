import React, { useState } from 'react';
import {
  Radio,
  Switch,
  Input,
  Dropdown,
  MenuProps,
  RadioChangeEvent,
  Flex,
  Space,
} from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';

import { usePythiaData } from 'Providers/PythiaData';
import { useSubscriptionsFilters } from 'Providers/SubscriptionsFilters';
import { mapChainsToOptions } from '../../../utils/helper';
import { SecondaryButton } from 'Components/SecondaryButton';
import styles from './FiltersBar.scss';
import { MultiSelect } from 'Components/Select';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import { OptionType } from 'Interfaces/subscription';

const FiltersBar = () => {
  const { chains } = usePythiaData();
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const {
    showInactive,
    showMine,
    filterByType,
    setShowMine,
    setShowInactive,
    setFilterByType,
    setChainIds,
    debouncedChangeHandler,
  } = useSubscriptionsFilters();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchVisible, setSearchIsVisible] = useState(false);
  const [isFiltersMenuOpen, setFiltersMenuOpen] = useState(false);

  const onChainSelect = (val: OptionType[]) => {
    setChainIds(val?.map((s: OptionType) => s.value.toString()) ?? []);
  };

  const onChangeType = (e: RadioChangeEvent) => {
    setFilterByType(e.target.value);
    searchParams.set('type', e.target.value);
    setSearchParams(searchParams);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Radio.Group
          value={filterByType}
          onChange={onChangeType}
          defaultValue="Price"
          size="small"
          options={[
            { label: 'All', value: 'all' },
            { label: 'Price', value: 'price' },
            { label: 'Random', value: 'random' },
          ]}
          optionType="button"
        ></Radio.Group>
      ),
    },
    {
      key: '2',
      label: (
        <>
          <Switch
            size="small"
            checked={showMine}
            onChange={() => {
              setShowMine(!showMine);
              searchParams.set('showMine', new Boolean(!showMine).toString());
              setSearchParams(searchParams);
            }}
            style={{ marginRight: 10 }}
          />
          Mine
        </>
      ),
    },
    {
      key: '3',
      label: (
        <>
          <Switch
            size="small"
            checked={showInactive}
            onChange={() => {
              setShowInactive(!showInactive);
              searchParams.set('showInactive', new Boolean(!showInactive).toString());
              setSearchParams(searchParams);
            }}
            style={{ marginRight: 10 }}
          />
          Show inactive
        </>
      ),
    },
    {
      key: '4',
      label: (
        <MultiSelect
          className={styles.chainSelect}
          classNamePrefix="react-select"
          styles={{
            multiValue: (base: any) => ({
              ...base,
              backgroundColor: '#070E1B',
              borderRadius: '50%',
              padding: '2px',
            }),
          }}
          options={mapChainsToOptions(chains)}
          onChange={onChainSelect}
          placeholder="Chain"
        />
      ),
    },
  ];

  return (
    <Flex style={{ flex: 1 }} justify="space-between" wrap="wrap" gap={8}>
      {isMobile ? (
        <Dropdown menu={{ items }} trigger={['click']}>
          <SecondaryButton
            type="text"
            icon={<FilterOutlined />}
            size="large"
            onClick={() => setFiltersMenuOpen(!isFiltersMenuOpen)}
          />
        </Dropdown>
      ) : (
        <>
          <Space>
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
            <Switch
              checked={showMine}
              onChange={() => {
                setShowMine(!showMine);
                searchParams.set('showMine', new Boolean(!showMine).toString());
                setSearchParams(searchParams);
              }}
              style={{ marginRight: 10 }}
            />
            Mine
            <Switch
              checked={showInactive}
              onChange={() => {
                setShowInactive(!showInactive);
                searchParams.set('showInactive', new Boolean(!showInactive).toString());
                setSearchParams(searchParams);
              }}
              style={{ marginRight: 10 }}
            />
            Inactive
          </Space>
          <Space>
            <MultiSelect
              className={styles.chainSelect}
              classNamePrefix="react-select"
              styles={{
                multiValue: (base: any) => ({
                  ...base,
                  backgroundColor: '#070E1B',
                  borderRadius: '50%',
                  padding: '2px',
                }),
              }}
              options={mapChainsToOptions(chains)}
              onChange={onChainSelect}
              placeholder="Chain"
            />
            <Input
              size="large"
              placeholder="Search..."
              onChange={debouncedChangeHandler}
              style={{ width: 180, maxHeight: '38px' }}
              allowClear
              prefix={<SearchOutlined style={{ color: '#1D2E51' }} />}
            />
          </Space>
        </>
      )}
    </Flex>
  );
};

export default FiltersBar;
