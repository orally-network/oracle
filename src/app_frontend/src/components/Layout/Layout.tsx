import React, { useState } from 'react';
import { Button, ConfigProvider, theme, Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import Header from 'Components/Header';
import Footer from 'Components/Footer';
import { Sidebar } from 'Components/Sidebar/Sidebar';
import { orallyTheme } from 'Constants/themes';

export const BaseLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { defaultAlgorithm } = theme;

  return (
    <ConfigProvider theme={isDarkMode ? orallyTheme : { algorithm: defaultAlgorithm }}>
      <Header />
      <Layout>
        <Sidebar toggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} />
        <Layout>
          <Outlet />
          <Footer />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
