import * as React from "react";
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';

import ErrorBoundary from 'Shared/ErrorBoundary';

import App from './App';

import 'Styles/index.scss';
import '!style-loader!css-loader!react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#app');

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

const container = document.getElementById('app');

const root = createRoot(container);

import('./rollbar').then(() => {
  root.render(
    <ErrorBoundary>
      <BrowserRouter>
        <WagmiConfig client={client}>
          <App />

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </WagmiConfig>
      </BrowserRouter>
    </ErrorBoundary>
  );
});
