import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeFilled, UnorderedListOutlined, AccountBookFilled } from '@ant-design/icons';

import styles from './Navigation.module.scss';

interface NavigationProps {
  isDarkMode: boolean;
  closeSideBar: () => void;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string | React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    key: '0',
    icon: <HomeFilled />,
    label: (
      <NavLink
        to="/sybil"
        className={({ isActive, isPending }) =>
          isPending ? styles.pending : isActive ? styles.active : ''
        }
      >
        Sybil
      </NavLink>
    ),
  },
  // {
  //   key: '1',
  //   icon: <UnorderedListOutlined />,
  //   label: (
  //     <NavLink
  //       to="/pythia"
  //       className={({ isActive, isPending }) =>
  //         isPending ? styles.pending : isActive ? styles.active : ''
  //       }
  //     >
  //       Pythia
  //     </NavLink>
  //   ),
  // },
  {
    key: '2',
    icon: <AccountBookFilled />,
    label: (
      <NavLink
        to="/apollo"
        className={({ isActive, isPending }) =>
          isPending ? styles.pending : isActive ? styles.active : ''
        }
      >
        Apollo
      </NavLink>
    ),
  },
];

export const Navigation = ({ isDarkMode, closeSideBar }: NavigationProps) => {
  return (
    <Menu
      theme={isDarkMode ? 'dark' : 'light'}
      mode="inline"
      items={menuItems}
      onClick={closeSideBar}
    />
  );
};
