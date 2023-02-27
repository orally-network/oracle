import React from 'react';

import Connect from 'Shared/Connect';
import logoSrc from 'Assets/logo.png';

import styles from './Header.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img src={logoSrc} className={styles.logoImg} alt="Orally" />
      </div>

      <Connect className={styles.connect} />
    </div>
  )
};

export default Header;
