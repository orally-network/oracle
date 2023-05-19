import React from 'react';

import styles from './ChainLogo.scss';

const ChainLogo = ({ chain }) => {
  return (
    <>
      {typeof chain.img === 'string' && <img className={styles.logo} src={chain.img} alt={chain.name} />}
      {typeof chain.img !== 'string' && <chain.img className={styles.logo} />}
    </>
  )
}

export default ChainLogo;