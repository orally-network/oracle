import React from 'react';

import styles from './ChainLogo.scss';

interface ChainLogoProps {
  chain: any;
  isSelect?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const logoSize = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

const ChainLogo = ({ chain, isSelect = false, size = 'medium' }: ChainLogoProps) => {
  return (
    <>
      {typeof chain.img === 'string' && (
        <img
          className={
            isSelect
              ? `${styles.selectLogo} ${styles[logoSize[size]]}`
              : `${styles.logo} ${styles[logoSize[size]]}`
          }
          src={chain.img}
          alt={chain.name}
        />
      )}
      {typeof chain.img !== 'string' && (
        <chain.img
          className={
            isSelect
              ? `${styles.selectLogo} ${styles[logoSize[size]]}`
              : `${styles.logo} ${styles[logoSize[size]]}`
          }
        />
      )}
    </>
  );
};

export default ChainLogo;
