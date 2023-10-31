import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Layout, Button } from 'antd';

import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

import styles from './Sidebar.scss';
import { Navigation } from 'Components/Navigation';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_DESKTOP_LARGE } from 'Constants/ui';
import LogoImage from 'Assets/image-logo.svg';
import LogoText from 'Assets/logo.svg';

const { Sider } = Layout;

interface SidebarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Sidebar = ({ toggleTheme, isDarkMode }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const { width } = useWindowDimensions();

  const isLargeDesktop = width >= BREAK_POINT_DESKTOP_LARGE;

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={isLargeDesktop ? 400 : 200}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 2,
        padding: '24px 0',
      }}
    >
      <div className={styles.logo}>
        {collapsed ? <LogoImage height={35} /> : <LogoText height={35} />}
      </div>
      <Navigation isDarkMode={isDarkMode} />
      <div className={styles.control}>
        <Button
          type="text"
          icon={collapsed ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 42,
            height: 42,
            borderRadius: '50%',
            border: isDarkMode ? '4px solid #020915' : '4px solid lightgray',
            background: isDarkMode ? '#0C172B' : 'gray',
            color: '#1766F9',
          }}
        />
      </div>
      <div className={styles.toggler}>
        <FontAwesomeIcon onClick={toggleTheme} icon={isDarkMode ? faSun : faMoon} />
        <FontAwesomeIcon icon={faQuestion} />
      </div>
    </Sider>
  );
};
