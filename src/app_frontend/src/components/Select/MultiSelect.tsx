import { TOKEN_IMAGES } from 'Constants/tokens';
import React, { useMemo } from 'react';
import Select, { components, MultiValueGenericProps } from 'react-select';
import { Flex } from 'antd';
import ChainLogo from 'Shared/ChainLogo';
import { CHAINS_MAP } from 'Constants/chains';

export const MultiValueContainerChain = (props: MultiValueGenericProps) => {
  return (
    <components.MultiValueContainer {...props}>
      <Flex align="center" gap="small">
        <ChainLogo chain={CHAINS_MAP[props.data.value]} isSelect={true} />
      </Flex>
    </components.MultiValueContainer>
  );
};

export const MultiValueContainerToken = (props: MultiValueGenericProps) => {
  const logoParam = useMemo(() => {
    return {
      img: TOKEN_IMAGES[props.data.label] ?? TOKEN_IMAGES.default,
      name: props.data.label,
    };
  }, [props.data.label]);

  return (
    <components.MultiValueContainer {...props}>
      <Flex align="center" gap="small">
        <ChainLogo chain={logoParam} isSelect={true} />
      </Flex>
    </components.MultiValueContainer>
  );
};

export const OptionChain = (props: any) => {
  return (
    <components.Option {...props}>
      <Flex align="center" gap="small">
        <ChainLogo chain={CHAINS_MAP[props.data.value]} /> {CHAINS_MAP[props.data.value].name}
      </Flex>
    </components.Option>
  );
};

export const OptionToken = (props: any) => {
  const logoParam = useMemo(() => {
    return {
      img: TOKEN_IMAGES[props.data.label] ?? TOKEN_IMAGES.default,
      name: props.data.label,
    };
  }, [props.data.label]);

  return (
    <components.Option {...props}>
      <Flex align="center" gap="small">
        <ChainLogo chain={logoParam} /> {props.data.label}
      </Flex>
    </components.Option>
  );
};

export const MultiSelect = (props: any & { isToken: boolean }) => {
  return (
    <Select
      closeMenuOnSelect={false}
      isMulti
      components={{
        Option: props.isToken ? OptionToken : OptionChain,
        MultiValueContainer: props.isToken ? MultiValueContainerToken : MultiValueContainerChain,
        IndicatorSeparator: () => null
    }}
      {...props}
    />
  );
};
