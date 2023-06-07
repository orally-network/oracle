import React from 'react';
import { NavLink } from 'react-router-dom';
import { Space, Layout } from 'antd';

import Connect from 'Shared/Connect';
import Button from 'Components/Button';
import logoSrc from 'Assets/logo.png';

import styles from './Header.scss';

const Header = () => {
  return (
    <Layout.Header className={styles.header}>
      <Space className={styles.logo}>
        <img src={logoSrc} className={styles.logoImg} alt="Orally" />
      </Space>

      <Space>
        <div className={styles.nav}>
          <NavLink
            to="/sybil"
            className={({ isActive, isPending }) =>
              isPending ? styles.pending : isActive ? styles.active : ""
            }
          >
            <Button
              className={styles.navButton}
            >
              Sybil
            </Button>
          </NavLink>

          <NavLink
            to="/pythia"
            className={({ isActive, isPending }) =>
              isPending ? styles.pending : isActive ? styles.active : ""
            }
          >
            <Button
              className={styles.navButton}
            >
              Pythia
            </Button>
          </NavLink>
        </div>

        <Connect className={styles.connect} />
      </Space>
    </Layout.Header>
  )
};

export default Header;
