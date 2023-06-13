import React from "react";
import { Space, Spin } from "antd";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";

import { SybilPairsProvider } from "Providers/SybilPairs";
import { PythiaDataProvider } from "Providers/PythiaData";
import { GlobalStateProvider } from "Providers/GlobalState";
import Header from "Components/Header";
import Pythia from "Pages/Pythia";
import Sybil from "Pages/Sybil";
import ROUTES from "./constants/routes";

const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      {
        // Default route navigation
        index: true,
        element: <Navigate to={`/${ROUTES.SYBIL}`} replace />,
      },
      {
        path: ROUTES.SYBIL,
        element: <Sybil />,
      },
      // TODO: Show when pythia is ready
      // {
      //   path: ROUTES.PYTHIA,
      //   element: <Pythia />,
      // },
    ],
  },
]);

const App = () => {
  return (
    <GlobalStateProvider>
      <PythiaDataProvider>
        <SybilPairsProvider>
          <RouterProvider
            router={router}
            fallbackElement={
              <Space size="large">
                <Spin size="large" />
              </Space>
            }
          />
        </SybilPairsProvider>
      </PythiaDataProvider>
    </GlobalStateProvider>
  );
};

export default App;
