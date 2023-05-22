import React from 'react';
import { NavLink } from 'react-router-dom';

import Connect from 'Shared/Connect';
import Button from 'Components/Button';
import logoSrc from 'Assets/logo.png';

import styles from './Header.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img src={logoSrc} className={styles.logoImg} alt="Orally" />
      </div>
      
      <div className={styles.nav}>
        <Button
          className={styles.navButton}
        >
          <NavLink
            to="/sybil"
            className={({ isActive, isPending }) =>
              isPending ? styles.pending : isActive ? styles.active : ""
            }
          >
            Sybil
          </NavLink>
        </Button>

        <Button
          className={styles.navButton}
        >
          <NavLink
            to="/pythia"
            className={({ isActive, isPending }) =>
              isPending ? styles.pending : isActive ? styles.active : ""
            }
          >
            Pythia
          </NavLink>
        </Button>
      </div>

      <Connect className={styles.connect} />
    </div>
  )
};

export default Header;
