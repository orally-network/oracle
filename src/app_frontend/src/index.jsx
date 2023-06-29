import * as React from "react";
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { mainnet, goerli, polygon, polygonMumbai, sepolia } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';

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

const { chains, provider, webSocketPublicClient, publicClient } = configureChains(
  [mainnet, goerli, sepolia, polygon, polygonMumbai, CHAINS_MAP[35443], CHAINS_MAP[35441], CHAINS_MAP[1230], CHAINS_MAP[1231], CHAINS_MAP[59140], CHAINS_MAP[1313161554], CHAINS_MAP[355113], CHAINS_MAP[1313161555]],
  [
    infuraProvider({ apiKey: config.INFURA_API_KEY, stallTimeout: 1_000, }),
    alchemyProvider({ apiKey: config.ALCHEMY_API_KEY, stallTimeout: 1_000, }),
    publicProvider(),
  ],
)

// Set up client
const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  connectors: [
    new MetaMaskConnector({ chains }),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: 'orally',
    //     projectId: 'orally',
    //   },
    // }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     qrcode: true,
    //   },
    // }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketPublicClient,
})

const container = document.getElementById('app');

const root = createRoot(container);

import('./rollbar').then(() => {
  root.render(
    <ErrorBoundary>
      <WagmiConfig config={wagmiConfig}>
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
