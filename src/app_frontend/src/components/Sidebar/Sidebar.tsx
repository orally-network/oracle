import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Layout, Button } from 'antd';

import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import styles from './Sidebar.scss';
import { Navigation } from 'Components/Navigation';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_DESKTOP_LARGE, BREAK_POINT_MOBILE } from 'Constants/ui';
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
  const isMobile = width <= BREAK_POINT_MOBILE;

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={isLargeDesktop ? 400 : 200}
      breakpoint="sm"
      collapsedWidth={isMobile ? 0 : 80}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 2,
        padding: isMobile ? '50px 0' : '24px 0',
      }}
    >
      {!isMobile && (
        <div className={styles.logo}>
          {collapsed ? <LogoImage height={35} /> : <LogoText height={35} />}
        </div>
      )}
      <Navigation isDarkMode={isDarkMode} />
      <div className={styles.control}>
        {isMobile ? (
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={
              collapsed ? (
                <MenuOutlined style={{ fontSize: '24px' }} />
              ) : (
                <CloseOutlined style={{ fontSize: '24px' }} />
              )
            }
            style={{
              width: 24,
              height: 24,
              color: '#1766F9',
            }}
          />
        ) : (
          <Button
            type="text"
            icon={
              collapsed ? (
                <ArrowRightOutlined style={{ fontSize: '16px' }} />
              ) : (
                <ArrowLeftOutlined style={{ fontSize: '16px' }} />
              )
            }
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
        )}
      </div>
      <div className={styles.toggler}>
        {/* <FontAwesomeIcon onClick={toggleTheme} icon={isDarkMode ? faSun : faMoon} /> */}
        <div className={styles.support}>
          <FontAwesomeIcon icon={faQuestion} />
        </div>
      </div>
    </Sider>
  );
};
