import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeFilled, UnorderedListOutlined } from '@ant-design/icons';

import styles from './Navigation.scss';

interface NavigationProps {
  isDarkMode: boolean;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string | React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    key: '1',
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
  {
    key: '2',
    icon: <UnorderedListOutlined />,
    label: (
      <NavLink
        to="/pythia"
        className={({ isActive, isPending }) =>
          isPending ? styles.pending : isActive ? styles.active : ''
        }
      >
        Pythia
      </NavLink>
    ),
  },
];

export const Navigation = ({ isDarkMode }: NavigationProps) => {
  return (
    <Menu
      theme={isDarkMode ? 'dark' : 'light'}
      mode="inline"
      defaultSelectedKeys={['1']}
      items={menuItems}
    />
  );
};
