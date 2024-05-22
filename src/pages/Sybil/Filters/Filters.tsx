import React, { useState } from 'react';
import { Radio, Switch, Input, Dropdown, MenuProps, RadioChangeEvent, Flex, Space } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { SecondaryButton } from 'Components/SecondaryButton';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useSybilData from 'Providers/SybilPairs/useSybilFeeds';

export const Filters = () => {
  const {
    showMine,
    feedType,
    setShowMine,
    setFeedType,
    searchQuery,
    setSearchQuery,
    debouncedChangeHandler,
  } = useSybilData();
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersMenuOpen, setFiltersMenuOpen] = useState(false);

  const onChangeType = (e: RadioChangeEvent) => {
    setFeedType(e.target.value);
    searchParams.set('type', e.target.value);
    setSearchParams(searchParams);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Radio.Group
          value={feedType}
          onChange={onChangeType}
          defaultValue="Price"
          size="small"
          options={[
            { label: 'All', value: 'All' },
            { label: 'Default', value: 'Default' },
            { label: 'Custom', value: 'Custom' },
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
              value={feedType}
              onChange={onChangeType}
              defaultValue="Price"
              size="large"
              options={[
                { label: 'All', value: 'All' },
                { label: 'Default', value: 'Default' },
                { label: 'Custom', value: 'Custom' },
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
          </Space>
          <Space>
            <Input
              size="large"
              placeholder="Search..."
              onChange={debouncedChangeHandler}
              style={{ width: 180, maxHeight: '38px' }}
              allowClear
              suffix={<SearchOutlined style={{ color: '#1D2E51' }} />}
            />
          </Space>
        </>
      )}
    </Flex>
  );
};
