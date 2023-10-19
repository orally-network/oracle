import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RiseOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

import styles from './Sidebar.scss';

const { Sider } = Layout;

interface SidebarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Sidebar = ({ toggleTheme, isDarkMode }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={styles.container}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: '100%',
        }}
        // style={{
        //   overflow: 'auto',
        //   height: '100vh',
        //   position: 'fixed',
        //   left: 0,
        //   top: '64px',
        //   bottom: 0,
        //   zIndex: 1,
        // }}
      >
        <Menu theme={isDarkMode ? 'dark' : 'light'} mode="inline" defaultSelectedKeys={['2']}>
          <Menu.Item key="2" icon={<AppstoreOutlined />} title="Sybil">
            <NavLink
              to="/sybil"
              className={({ isActive, isPending }) =>
                isPending ? styles.pending : isActive ? styles.active : ''
              }
            >
              Sybil
            </NavLink>
          </Menu.Item>
          <Menu.Item key="1" icon={<RiseOutlined />} title="Pythia">
            <NavLink
              to="/pythia"
              className={({ isActive, isPending }) =>
                isPending ? styles.pending : isActive ? styles.active : ''
              }
            >
              Pythia
            </NavLink>
          </Menu.Item>
        </Menu>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <div className={styles.toggler}>
          <FontAwesomeIcon onClick={toggleTheme} icon={isDarkMode ? faSun : faMoon} />
        </div>
      </Sider>
    </div>
  );
};
