import React, { useState } from 'react';
import { ConfigProvider, Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import Header from 'Components/Header';
import Footer from 'Components/Footer';
import { Sidebar } from 'Components/Sidebar/Sidebar';
import { orallyTheme, lightTheme } from 'Constants/themes';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { BREAK_POINT_MOBILE } from 'Constants/ui';

export const BaseLayout = ({ children }: { children?: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  return (
    <ConfigProvider theme={isDarkMode ? orallyTheme : lightTheme}>
      <Header />
      <Layout className={isDarkMode ? 'dark-theme' : 'light-theme'}>
        <Sidebar toggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} />
        <Layout style={{ marginLeft: isMobile ? 0 : '47px', padding: '64px 20px 20px 30px' }}>
          {children ?? <Outlet />}
          <Footer />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
