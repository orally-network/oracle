import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import {
  CloudOutlined,
  DeploymentUnitOutlined,
  HomeFilled,
  UnorderedListOutlined,
} from '@ant-design/icons';

import styles from './Navigation.scss';

interface NavigationProps {
  isDarkMode: boolean;
  closeSideBar: () => void;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string | React.ReactNode;
  path: '/sybil' | '/pythia' | '/apollo' | '/weather-auction';
}

const menuItems: MenuItem[] = [
  {
    key: '0',
    path: '/sybil',
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
    path: '/pythia',
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
    path: '/apollo',
    icon: <DeploymentUnitOutlined />,
    label: <NavLink to="/apollo">Apollo</NavLink>,
  },
  {
    key: '3',
    path: '/weather-auction',
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
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const activeLinkIndex = menuItems.findIndex((item) => item.path === activeLink);
  const key = activeLinkIndex.toString();

  return (
    <Menu
      theme={isDarkMode ? 'dark' : 'light'}
      mode="inline"
      defaultSelectedKeys={[key]}
      items={menuItems}
      onClick={closeSideBar}
    />
  );
};
