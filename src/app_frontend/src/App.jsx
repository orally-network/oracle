import React, { useState } from 'react';
import { Button, Space, Spin, ConfigProvider, theme } from 'antd';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

import { SybilPairsProvider } from 'Providers/SybilPairs';
import { PythiaDataProvider } from 'Providers/PythiaData';
import { GlobalStateProvider } from 'Providers/GlobalState';
import { SubscriptionsFiltersProvider } from 'Providers/SubscriptionsFilters';
import Header from 'Components/Header';
import Footer from 'Components/Footer';
import Pythia from 'Pages/Pythia';
import Sybil from 'Pages/Sybil';
import ROUTES from 'Constants/routes';
import rollbar from './rollbar';

const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    ),
    children: [
      {
        // Default route navigation
        index: true,
        element: <Navigate to={`/${ROUTES.PYTHIA}`} replace />,
      },
      {
        path: ROUTES.SYBIL,
        element: <Sybil />,
      },
      {
        path: ROUTES.PYTHIA,
        element: <Pythia />,
      },
    ],
  },
]);

const orallyTheme = {
  components: {
    Button: {
      colorPrimary: 'var(--primary-color, rgb(48, 36, 246))',
      colorPrimaryHover: '#5393FF',
      colorPrimaryActive: '#1C5FCE',
      colorBgContainer: 'var(--background-color, #020915)',
      colorBgContainerDisabled: 'grey',
      colorTextDisabled: '#7D8FA9',
      colorText: '#B9D6FA',
      colorBorder: '#B9D6FA',
      defaultShadow: 'none',
      primaryShadow: 'none',
      borderRadius: '14px',
      colorBgTextHover: 'red',
      textHoverBg: 'green',
    },
    Input: {
      colorPrimary: '#eb2f96',
      // algorithm: true, // Enable algorithm
    },
    Switch: {
      colorPrimary: 'rgb(48, 36, 246))',
      colorBgContainer: 'white !important',
    },
  },
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { defaultAlgorithm, darkAlgorithm } = theme;

  return (
    <ConfigProvider theme={isDarkMode ? orallyTheme : { algorithm: defaultAlgorithm }}>
      {/* <Button onClick={() => setIsDarkMode(!isDarkMode)}>{isDarkMode ? 'Dark' : 'Light'}</Button> */}
      <RollbarProvider instance={rollbar}>
        <ErrorBoundary>
          <GlobalStateProvider>
            <PythiaDataProvider>
              <SybilPairsProvider>
                <SubscriptionsFiltersProvider>
                  <RouterProvider
                    router={router}
                    fallbackElement={
                      <Space size="large">
                        <Spin size="large" />
                      </Space>
                    }
                  />
                </SubscriptionsFiltersProvider>
              </SybilPairsProvider>
            </PythiaDataProvider>
          </GlobalStateProvider>
        </ErrorBoundary>
      </RollbarProvider>
    </ConfigProvider>
  );
};

export default App;
