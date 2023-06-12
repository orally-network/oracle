import React from 'react';
import { Space, Spin } from 'antd';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { SybilPairsProvider } from 'Providers/SybilPairs';
import { PythiaDataProvider } from 'Providers/PythiaData';
import { GlobalStateProvider } from 'Providers/GlobalState';
import Header from 'Components/Header';
import Pythia from 'Pages/Pythia';
import Sybil from 'Pages/Sybil';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />

        <Sybil />
      </>
    ),
  },
  {
    path: 'sybil',
    element: (
      <>
        <Header />
        
        <Sybil />
      </>
    ),
  },
  // todo: unhide when pythia is ready
  // {
  //   path: 'pythia',
  //   element: (
  //     <>
  //       <Header />
  //
  //       <Pythia />
  //     </>
  //   ),
  // },
]);

const App = () => {
  return (
    <GlobalStateProvider>
      <PythiaDataProvider>
        <SybilPairsProvider>
          <RouterProvider
            router={router}
            fallbackElement={(
              <Space size="large">
                <Spin size="large" />
              </Space>
            )}
          />
        </SybilPairsProvider>
      </PythiaDataProvider>
    </GlobalStateProvider>
  );
}

export default App;
