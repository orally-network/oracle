import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Space, Spin } from 'antd';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { GlobalStateProvider } from 'Providers/GlobalState';

import { BaseLayout } from 'Components/Layout';

import Pythia from 'Pages/Pythia';
import Sybil from 'Pages/Sybil';
import ROUTES from 'Constants/routes';
import rollbar from './rollbar';
import { SubscriptionDetailsPage } from 'Pages/SubscriptionDetailsPage';
import ErrorPage from 'Pages/ErrorPage';
import { CACHE_TIME, QUERY_CLIENT_DEFAULT_RETRY_COUNT, TIME_TO_WAIT } from 'Constants/query';

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: TIME_TO_WAIT,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      refetchInterval: TIME_TO_WAIT,
      cacheTime: CACHE_TIME,
      retry: QUERY_CLIENT_DEFAULT_RETRY_COUNT,
    },
  },
});

const App = () => {
  return (
    <RollbarProvider instance={rollbar}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GlobalStateProvider>
            <RouterProvider
              router={router}
              fallbackElement={
                <Space size="large">
                  <Spin size="large" />
                </Space>
              }
            />
          </GlobalStateProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default App;
