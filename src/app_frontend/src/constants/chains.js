import { mainnet, goerli, polygon, polygonMumbai } from 'wagmi/chains';

import ethereumImg from 'Assets/chains/ethereum.jpeg';
import polygonImg from 'Assets/chains/polygon.jpeg';
import ultronImg from 'Assets/chains/ultron.jpeg';
import qImg from 'Assets/chains/q.svg';
import auroraImg from 'Assets/chains/aurora.png';

const CHAINS = [
  {
    ...mainnet,
    img: ethereumImg,
  },
  {
    ...goerli,
    img: ethereumImg,
  },
  {
    ...polygon,
    img: polygonImg,
  },
  {
    ...polygonMumbai,
    img: polygonImg,
  },
  {
    id: 1231,
    name: 'Ultron',
    network: 'Ultron',
    nativeCurrency: {
      name: 'ULX',
      symbol: 'TULX',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://ultron-rpc.net']
      },
      public: {
        http: ['https://ultron-rpc.net']
      },
    },
    testnet: false,
    img: ultronImg,
  },
  {
    id: 1230,
    name: 'Ultron Testnet',
    network: 'Ultron testnet',
    nativeCurrency: {
      name: 'Testnet ULX',
      symbol: 'TULX',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://ultron-dev.io']
      },
      public: {
        http: ['https://ultron-dev.io']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Ultron Testnet',
        url: 'https://explorer.ultron-dev.io/',
      },
    },
    testnet: true,
    img: ultronImg,
  },
  {
    id: 35443,
    name: 'Q Testnet',
    network: 'Q testnet',
    nativeCurrency: {
      name: 'Q',
      symbol: 'Q',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.qtestnet.org']
      },
      public: {
        http: ['https://rpc.qtestnet.org']
      },
    }, 
    blockExplorers: {
      default: {
        name: 'Explorer Q Testnet', 
        url: 'https://explorer.qtestnet.org/',
      },
    }, 
    testnet: true,
    img: qImg,
  },
  {
    id: 1313161555,
    name: 'Aurora Testnet',
    network: 'Aurora testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://testnet.aurora.dev']
      },
      public: {
        http: ['https://testnet.aurora.dev']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Aurora Testnet',
        url: 'https://testnet.aurorascan.dev/',
      },
    },
    testnet: true,
    img: auroraImg,
  },
];

export const CHAINS_MAP = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain;

  return acc;
}, {});

export default CHAINS;
