import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import { CloudOutlined, HomeFilled, UnorderedListOutlined } from '@ant-design/icons';

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
  {
    key: '1',
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
  {
    key: '2',
    icon: <CloudOutlined />,
    label: (
      <NavLink
        to="/weather-auction"
        className={({ isActive, isPending }) =>
          isPending ? styles.pending : isActive ? styles.active : ''
        }
      >
        Weather Auction
      </NavLink>
    ),
  },
];

export const Navigation = ({ isDarkMode, closeSideBar }: NavigationProps) => {
  return (
    <Menu
      theme={isDarkMode ? 'dark' : 'light'}
      mode="inline"
      defaultSelectedKeys={['1']}
      items={menuItems}
      onClick={closeSideBar}
    />
  );
};
