import React from 'react';

import { useWeb3Modal } from '@web3modal/wagmi/react';

import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';

const Connect = () => {
  const { open, close } = useWeb3Modal();
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  return <w3m-button balance={isMobile ? 'hide' : 'show'} />;
};

export default Connect;
