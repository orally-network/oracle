import React from 'react';

import Connect from 'Shared/Connect';

import styles from './Header.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>ORALLY</div>

      <Connect className={styles.connect} />
    </div>
  )
};

export default Header;
