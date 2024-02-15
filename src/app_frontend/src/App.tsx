import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Space, Spin } from 'antd';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { GlobalStateProvider } from 'Providers/GlobalState';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { HttpLink } from '@apollo/client';

import { BaseLayout } from 'Components/Layout';

import Pythia from 'Pages/Pythia';
import Sybil from 'Pages/Sybil';
import ROUTES from 'Constants/routes';
import rollbar from './rollbar';
import { SubscriptionDetailsPage } from 'Pages/SubscriptionDetailsPage';
import ErrorPage from 'Pages/ErrorPage';
import { CACHE_TIME, QUERY_CLIENT_DEFAULT_RETRY_COUNT, TIME_TO_WAIT } from 'Constants/query';
import { PythiaDataProvider } from 'Providers/PythiaData';
import { WeatherAuction } from 'Pages/WeatherAuction';

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
        element: <Navigate to={`/${ROUTES.WEATHER_AUCTION}`} replace />,
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
      {
        path: `${ROUTES.WEATHER_AUCTION}`,
        element: <WeatherAuction />,
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

const link = new HttpLink({
  uri: 'https://api.studio.thegraph.com/query/61274/orally-weather-auction/version/latest',
});

export const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <RollbarProvider instance={rollbar}>
      <ErrorBoundary>
        <ApolloProvider client={client}>
          <QueryClientProvider client={queryClient}>
            <GlobalStateProvider>
              <PythiaDataProvider>
                <RouterProvider
                  router={router}
                  fallbackElement={
                    <Space size="large">
                      <Spin size="large" />
                    </Space>
                  }
                />
              </PythiaDataProvider>
            </GlobalStateProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default App;
