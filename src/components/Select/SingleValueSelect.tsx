import { Flex } from 'antd';
import React, { useMemo } from 'react';
import Select, { components, Props } from 'react-select';

import { CHAINS_MAP } from 'Constants/chains';
import { TOKEN_IMAGES } from 'Constants/tokens';
import ChainLogo from 'Shared/ChainLogo';
import { OptionChain, OptionToken } from './MultiSelect';

export const SingleValueChain = ({ children, ...props }) => {
  return (
    <components.SingleValue {...props}>
      <Flex align="center" gap="small">
        <ChainLogo chain={CHAINS_MAP[children]}/> {CHAINS_MAP[props.data.value].name}
      </Flex>
    </components.SingleValue>
  );
};

const SingleValueToken = (props: any) => {
  const logoParam = useMemo(() => {
    return {
      img: TOKEN_IMAGES[props.data.label] ?? TOKEN_IMAGES.default,
      name: props.data.label,
    };
  }, [props.data.label]);

  return (
    <components.SingleValue {...props}>
      <Flex align="center" gap="small">
        <ChainLogo chain={logoParam}/> {props.data.label}
      </Flex>
    </components.SingleValue>
  );
};

export const SingleValueSelect = (props: Props & { isToken?: boolean }) => {
  return (
    <Select
      styles={{
        singleValue: (base) => ({
          ...base,
          borderRadius: 5,
          display: 'flex',
        }),
      }}
      components={{
        SingleValue: props.isToken ? SingleValueToken : SingleValueChain,
        Option: props.isToken ? OptionToken : OptionChain,
        IndicatorSeparator: () => null,
      }}
      {...props}
    />
  );
};
