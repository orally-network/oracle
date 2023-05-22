import React from 'react';
import { Space, Spin } from 'antd';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Header from 'Components/Header';
// import Oracles from 'Pages/Oracles';
import Pythia from 'Pages/Pythia';
import Sybil from 'Pages/Sybil';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Orally</div>,
  },
  // {
  //   path: "/oracles",
  //   element: <Oracles />,
  // },
  {
    path: 'sybil',
    element: (
      <>
        <Header />
        
        <Sybil />
      </>
    ),
  },
  {
    path: 'pythia',
    element: (
      <>
        <Header />

        <Pythia />
      </>
    ),
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider
        router={router}
        fallbackElement={(
          <Space size="large">
            <Spin size="large" />
          </Space>
        )}
      />
    </div>
  );
}

export default App;
