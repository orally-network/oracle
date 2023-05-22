import React from 'react';

import Feeds from './Feeds';

import styles from './Sybil.scss';

const Sybil = () => {
  return (
    <div className={styles.sybil}>
      <Feeds />
    </div>
  )
};

export default Sybil;