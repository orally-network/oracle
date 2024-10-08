import React, { useRef, useState } from 'react';
import { Layout, Button } from 'antd';

import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  MenuOutlined,
  CloseOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import styles from './Sidebar.module.scss';
import { Navigation } from 'Components/Navigation';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import { useOutsideClick } from 'Utils/useOutsideClick';

const { Sider } = Layout;

interface SidebarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Sidebar = ({ isDarkMode }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const { width } = useWindowDimensions();
  const siderRef = useRef(null);

  const isMobile = width <= BREAK_POINT_MOBILE;

  useOutsideClick(siderRef, () => {
    setCollapsed(true);
  });

  return (
    <Sider
      ref={siderRef}
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={200}
      breakpoint="sm"
      collapsedWidth={isMobile ? 0 : 47}
      style={{
        height: isMobile ? '100vh' : 'calc(100vh - 48px)',
        position: 'fixed',
        left: 0,
        bottom: 0,
        zIndex: 1003,
        top: isMobile ? 0 : '48px',
        padding: isMobile ? '50px 0 50px' : '0 0 50px',
      }}
    >
      <Navigation isDarkMode={isDarkMode} closeSideBar={() => setCollapsed(true)} />
      <div className={styles.control}>
        {isMobile ? (
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={
              collapsed ? (
                <MenuOutlined style={{ fontSize: '18px' }} />
              ) : (
                <CloseOutlined style={{ fontSize: '18px' }} />
              )
            }
            style={{
              width: 24,
              height: 24,
              color: '#1766F9',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
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
          <SettingOutlined />
        </div>
      </div>
    </Sider>
  );
};
