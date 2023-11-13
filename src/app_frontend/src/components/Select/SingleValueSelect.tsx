import React from 'react';
import { Option } from './MultiSelect';
import Select, { components, Props } from 'react-select';
import { Flex } from 'antd';

import { CHAINS_MAP } from 'Constants/chains';
import ChainLogo from 'Shared/ChainLogo';

export const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <Flex align="center" gap="small">
      <ChainLogo chain={CHAINS_MAP[children]} /> {CHAINS_MAP[props.data.value].name}
    </Flex>
  </components.SingleValue>
);

export const SingleValueSelect = (props: Props) => {
  return (
    <Select
      styles={{
        singleValue: (base) => ({
          ...base,
          borderRadius: 5,
          display: 'flex',
        }),
      }}
      components={{ SingleValue, Option }}
      {...props}
    />
  );
};
