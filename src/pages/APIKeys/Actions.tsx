import { Button, Flex } from 'antd';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import { useGlobalState } from 'Providers/GlobalState';
import React from 'react';
import { SignInButton } from 'Shared/SignInButton';
import { SybilTopUp } from 'Shared/SybilTopUp';
import useWindowDimensions from 'Utils/useWindowDimensions';

export const Actions = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const { addressData } = useGlobalState();

  return (
    <Flex justify="space-between" gap={8}>
      {addressData && addressData.signature ? (
        <>
          <SybilTopUp />

          <Button
            type="primary"
            size="large"
            onClick={() => {
            }}
            style={{ height: isMobile ? '40px' : 'auto', minWidth: '50px' }}
          >
            Generate API Key
          </Button>
        </>
      ) : (
        <SignInButton style={{ alignSelf: 'flex-end' }}/>
      )}
    </Flex>
  );
};