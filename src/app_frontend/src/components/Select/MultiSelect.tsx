import React from 'react';
import Select, { components, MultiValueGenericProps } from 'react-select';
import { Flex } from 'antd';
import ChainLogo from 'Shared/ChainLogo';
import { CHAINS_MAP } from 'Constants/chains';

export const MultiValueContainer = (props: MultiValueGenericProps) => {
  return (
    <components.MultiValueContainer {...props}>
      <Flex align="center" gap="small">
        <ChainLogo chain={CHAINS_MAP[props.data.value]} isSelect={true} />
      </Flex>
    </components.MultiValueContainer>
  );
};

export const Option = (props: any) => {
  return (
    <components.Option {...props}>
      <Flex align="center" gap="small">
        <ChainLogo chain={CHAINS_MAP[props.data.value]} /> {CHAINS_MAP[props.data.value].name}
      </Flex>
    </components.Option>
  );
};

export const MultiSelect = (props: any) => {
  return (
    <Select
      closeMenuOnSelect={false}
      isMulti
      components={{ Option, MultiValueContainer }}
      {...props}
    />
  );
};
