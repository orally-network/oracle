import React from 'react';

import styles from './Header.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>ORALLY</div>

      <div className={styles.connect}>
        Connect
      </div>
    </div>
  )
};

export default Header;
