import React from 'react';
import { Space, Spin } from 'antd';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

import { SybilPairsProvider } from 'Providers/SybilPairs';
import { PythiaDataProvider } from 'Providers/PythiaData';
import { GlobalStateProvider } from 'Providers/GlobalState';
import { SubscriptionsFiltersProvider } from 'Providers/SubscriptionsFilters';

import { BaseLayout } from 'Components/Layout';

import Pythia from 'Pages/Pythia';
import Sybil from 'Pages/Sybil';
import ROUTES from 'Constants/routes';
import rollbar from './rollbar';
import { SubscriptionDetailsPage } from 'Pages/SubscriptionDetailsPage';
import ErrorPage from 'Pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <BaseLayout />,
    errorElement: (
      <BaseLayout>
        <ErrorPage />
      </BaseLayout>
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
      {
        path: `${ROUTES.PYTHIA}/:chainId/:id`,
        element: <SubscriptionDetailsPage />,
      },
    ],
  },
]);

const App = () => {
  return (
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
  );
};

export default App;
