import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Layout, Button } from 'antd';

import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

import styles from './Sidebar.scss';
import { Navigation } from 'Components/Navigation';

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
          height: 'calc(100vh - 50px)',
          position: 'fixed',
          left: 0,
          zIndex: 2,
        }}
      >
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
    </div>
  );
};
