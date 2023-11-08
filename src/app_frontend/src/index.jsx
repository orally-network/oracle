import * as React from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import Modal from "react-modal";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, goerli, polygon, polygonMumbai, sepolia } from "wagmi/chains";
import { createPublicClient, http } from "viem";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import ErrorBoundary from "Shared/ErrorBoundary";
import config from "Constants/config";
import { CHAINS_MAP } from "Constants/chains";

import App from "./App";

import "Styles/index.scss";
import "!style-loader!css-loader!react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#app");

const { chains, provider, webSocketPublicClient, publicClient } =
  configureChains(
    [
      mainnet,
      goerli,
      sepolia,
      polygon,
      polygonMumbai,
      CHAINS_MAP[35443],
      CHAINS_MAP[35441],
      CHAINS_MAP[1230],
      CHAINS_MAP[1231],
      CHAINS_MAP[59140],
      CHAINS_MAP[1313161554],
      CHAINS_MAP[355113],
      CHAINS_MAP[1313161555],
      CHAINS_MAP[167005],
      CHAINS_MAP[59144],
    ],
    [
      infuraProvider({ apiKey: config.INFURA_API_KEY, stallTimeout: 1_000 }),
      alchemyProvider({ apiKey: config.ALCHEMY_API_KEY, stallTimeout: 1_000 }),
      publicProvider(),
    ]
  );

// Set up client
const projectId = "26360338ea435e287ccf74c9cf7db272";

// check it later
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: "light",
});

const container = document.getElementById("app");

const root = createRoot(container);

import("./rollbar").then(() => {
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
