import React from 'react';

import styles from './ChainLogo.scss';

interface ChainLogoProps {
  chain: any;
  isSelect?: boolean;
}

const ChainLogo = ({ chain, isSelect = false }: ChainLogoProps) => {
  return (
    <>
      {typeof chain.img === 'string' && (
        <img
          className={isSelect ? styles.selectLogo : styles.logo}
          src={chain.img}
          alt={chain.name}
        />
      )}
      {typeof chain.img !== 'string' && (
        <chain.img className={isSelect ? styles.selectLogo : styles.logo} />
      )}
    </>
  );
};

export default ChainLogo;
