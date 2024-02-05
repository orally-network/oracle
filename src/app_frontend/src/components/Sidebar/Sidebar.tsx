import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Layout, Button } from 'antd';

import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  MenuOutlined,
  CloseOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import styles from './Sidebar.scss';
import { Navigation } from 'Components/Navigation';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_DESKTOP_LARGE, BREAK_POINT_MOBILE } from 'Constants/ui';
import { useOutsideClick } from 'Utils/useOutsideClick';

const { Sider } = Layout;

interface SidebarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Sidebar = ({ toggleTheme, isDarkMode }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const { width } = useWindowDimensions();
  const siderRef = useRef(null);

  const isLargeDesktop = width >= BREAK_POINT_DESKTOP_LARGE;
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
        height: 'calc(100vh - 48px)',
        position: 'fixed',
        left: 0,
        bottom: 0,
        zIndex: 1003,
        padding: '0 0 50px',
      }}
    >
      <Navigation isDarkMode={isDarkMode} />
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
