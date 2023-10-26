import React, { useState } from 'react';
import { ConfigProvider, Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import Header from 'Components/Header';
import Footer from 'Components/Footer';
import { Sidebar } from 'Components/Sidebar/Sidebar';
import { orallyTheme, lightTheme } from 'Constants/themes';

export const BaseLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <ConfigProvider theme={isDarkMode ? orallyTheme : lightTheme}>
      <Header />
      <Layout>
        <Sidebar toggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} />
        <Layout style={{ marginLeft: '80px' }}>
          <Outlet />
          <Footer />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
