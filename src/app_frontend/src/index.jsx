import * as React from "react";
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { mainnet, goerli, polygon, polygonMumbai } from 'wagmi/chains';

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import ErrorBoundary from 'Shared/ErrorBoundary';
import config from 'Constants/config';
import { CHAINS_MAP } from 'Constants/chains';

import App from './App';

import 'Styles/index.scss';
import '!style-loader!css-loader!react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#app');

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai, CHAINS_MAP[35443], CHAINS_MAP[1230], CHAINS_MAP[1231]],
  [
    infuraProvider({ apiKey: config.INFURA_API_KEY, stallTimeout: 1_000, }),
    alchemyProvider({ apiKey: config.ALCHEMY_API_KEY, stallTimeout: 1_000, }),
    publicProvider(),
  ],
)

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'orally',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

const container = document.getElementById('app');

const root = createRoot(container);

import('./rollbar').then(() => {
  root.render(
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
});
