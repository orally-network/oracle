import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import Header from 'Components/Header';
import Oracles from 'Pages/Oracles';
import Pythia from 'Pages/Pythia';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Orally</div>,
  },
  {
    path: "/oracles",
    element: <Oracles />,
  },
  {
    path: 'pythia',
    element: <Pythia />,
  },
]);

const App = () => {
  return (
    <div>
      <Header />

      <RouterProvider router={router} />
    </div>
  );
}

export default App;
