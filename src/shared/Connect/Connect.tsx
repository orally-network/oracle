import React from 'react';

import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';

const Connect = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  return <w3m-button balance={isMobile ? 'hide' : 'show'} size="sm" />;
};

export default Connect;
