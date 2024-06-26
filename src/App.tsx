import { Space, Spin } from 'antd';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { GlobalStateProvider } from 'Providers/GlobalState';
import { NextUIProvider } from '@nextui-org/react';

import { BaseLayout } from 'Components/Layout';

import Pythia from 'Pages/Pythia';
import Sybil from 'Pages/Sybil';
import ROUTES from 'Constants/routes';
import { SubscriptionDetailsPage } from 'Pages/SubscriptionDetailsPage';
import ErrorPage from 'Pages/ErrorPage';
import { PythiaDataProvider } from 'Providers/PythiaData';
import { WeatherAuction } from 'Pages/WeatherAuction';
import { FeedDetailsPage } from 'Pages/FeedDetailsPage';
import SybilFeedsProvider from 'Providers/SybilPairs/SybilFeedsProvider';
import { WeatherDayDetailsWrapper } from 'Pages/WeatherDayDetails';
import { APIKeys } from 'Pages/APIKeys';
import { Apollo } from 'Pages/Apollo';
import { ApolloInstance } from 'Pages/ApolloInstance';


const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <BaseLayout/>,
    errorElement: (
      <BaseLayout>
        <ErrorPage/>
      </BaseLayout>
    ),
    children: [
      {
        // Default route navigation
        index: true,
        element: <Navigate to={`/${ROUTES.SYBIL}/api-keys`} replace/>,
      },
      {
        path: ROUTES.WEATHER_AUCTION,
        element: <Navigate to={`/${ROUTES.WEATHER_PREDICTION}`} replace/>,
      },
      {
        path: ROUTES.WEATHER_PREDICTION,
        element: <Navigate to={`/${ROUTES.WEATHER_PREDICTION}/denver`} replace/>,
      },
      {
        path: ROUTES.SYBIL,
        element: <Sybil/>,
      },
      {
        path: `${ROUTES.SYBIL}/:id`,
        element: <FeedDetailsPage/>,
      },
      {
        path: `${ROUTES.SYBIL}/api-keys`,
        element: <APIKeys/>,
      },
      {
        path: `${ROUTES.APOLLO}`,
        element: <Apollo/>,
      },
      {
        path: `${ROUTES.APOLLO}/:chainId`,
        element: <ApolloInstance/>,
      },
      {
        path: ROUTES.PYTHIA,
        element: <Pythia/>,
      },
      {
        path: `${ROUTES.PYTHIA}/:chainId/:id`,
        element: <SubscriptionDetailsPage/>,
      },
      {
        path: `${ROUTES.WEATHER_PREDICTION}/:city`,
        element: <WeatherAuction/>,
      },
      {
        path: `${ROUTES.WEATHER_PREDICTION}/:city/:day`,
        element: <WeatherDayDetailsWrapper/>,
      },
    ],
  },
]);

const App = () => {
  return (
    <GlobalStateProvider>
      <PythiaDataProvider>
        <SybilFeedsProvider>
          <NextUIProvider>
            <main className="dark text-foreground bg-background">
              <RouterProvider
                router={router}
                fallbackElement={
                  <Space size="large">
                    <Spin size="large"/>
                  </Space>
                }
              />
            </main>
          </NextUIProvider>
        </SybilFeedsProvider>
      </PythiaDataProvider>
    </GlobalStateProvider>
  );
};

export default App;
