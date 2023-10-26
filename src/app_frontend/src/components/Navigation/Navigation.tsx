import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import { PieChartOutlined, AppstoreOutlined, LineChartOutlined } from '@ant-design/icons';

import styles from './Navigation.scss';

interface NavigationProps {
  isDarkMode: boolean;
}

//todo: move items to array and map over them

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  title: string;
}

const menuItems: MenuItem[] = [
  {
    key: '1',
    icon: <AppstoreOutlined />,
    title: 'Sybil',
  },
];

export const Navigation = ({ isDarkMode }: NavigationProps) => {
  return (
    <Menu
      theme={isDarkMode ? 'dark' : 'light'}
      mode="inline"
      defaultSelectedKeys={['2']}
      // items={menuItems}
    >
      <Menu.Item
        key="1"
        icon={<AppstoreOutlined />}
        title="Sybil"
        style={{ paddingLeft: '24px', display: 'flex', alignItems: 'center' }}
      >
        <NavLink
          to="/sybil"
          className={({ isActive, isPending }) =>
            isPending ? styles.pending : isActive ? styles.active : ''
          }
        >
          Sybil
        </NavLink>
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<PieChartOutlined />}
        title="Pythia"
        style={{ paddingLeft: '24px', display: 'flex', alignItems: 'center' }}
      >
        <NavLink
          to="/pythia"
          className={({ isActive, isPending }) =>
            isPending ? styles.pending : isActive ? styles.active : ''
          }
        >
          Pythia
        </NavLink>
      </Menu.Item>
      <Menu.Item
        key="3"
        icon={<LineChartOutlined />}
        title="Delphi"
        style={{ paddingLeft: '24px', display: 'flex', alignItems: 'center' }}
      >
        <NavLink
          to="/delphi"
          className={({ isActive, isPending }) =>
            isPending ? styles.pending : isActive ? styles.active : ''
          }
        >
          Delphi
        </NavLink>
      </Menu.Item>
    </Menu>
  );
};
