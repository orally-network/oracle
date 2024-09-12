import { createRoot } from 'react-dom/client';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { WagmiProvider } from 'wagmi';
import { getWalletClient, switchChain } from '@wagmi/core';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { Toaster } from 'sonner';
// todo: remove later
import { ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import { createConfig as createLiFiConfig, EVM } from '@lifi/sdk';

import config from 'Constants/config';
import CHAINS from 'Constants/chains';

import rollbarSetup from './rollbarSetup';
import App from './App';

import 'Styles/index.scss';
import 'react-toastify/dist/ReactToastify.css';

// todo: remove later
Modal.setAppElement('#app');

createLiFiConfig({
  apiUrl: config.liFiApiUrl,
  integrator: config.liFiSdkIntegrator,
  providers: [
    EVM({
      getWalletClient: () => getWalletClient(wagmiConfig),
      switchChain: async (chainId) => {
        const chain = await switchChain(wagmiConfig, { chainId });
        return getWalletClient(wagmiConfig, { chainId: chain.id });
      },
    }),
  ],
});

// react query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: TIME_TO_WAIT,
      refetchOnMount: false,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      // refetchInterval: TIME_TO_WAIT,
      // cacheTime: CACHE_TIME,
      // retry: QUERY_CLIENT_DEFAULT_RETRY_COUNT,
    },
  },
});

const link = new HttpLink({
  uri: 'https://api.studio.thegraph.com/query/61274/orally-weather-auction/0.2.1',
});

export const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

// const { chains } = configureChains(CHAINS, [
//   infuraProvider({ apiKey: config.INFURA_API_KEY, stallTimeout: 1_000 }),
//   alchemyProvider({ apiKey: config.ALCHEMY_API_KEY, stallTimeout: 1_000 }),
//   publicProvider(),
// ]);

// check it later
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const projectId = config.wagmiConnectProjectId;

const wagmiConfig = defaultWagmiConfig({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  chains: CHAINS,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: 'dark',
  themeVariables: {
    // '--w3m-accent': '#ff7a45',
    // '--w3m-border-radius-master': '1px',
    // '--wui-font-size-small': '12px',
    // '--wui-font-weight-medium': '400',
    // '--w3m-font-family':
    //   '--apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
});

const container = document.getElementById('app');

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const root = createRoot(container);

import('./rollbarSetup').then(() => {
  root.render(
    <RollbarProvider instance={rollbarSetup}>
      <ErrorBoundary>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <ApolloProvider client={client}>
              <App />

              <Toaster />

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
            </ApolloProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ErrorBoundary>
    </RollbarProvider>,
  );
});
