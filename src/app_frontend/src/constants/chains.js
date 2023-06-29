import { mainnet, goerli, polygon, polygonMumbai, sepolia } from 'wagmi/chains';

import ethereumImg from 'Assets/chains/ethereum.jpeg';
import polygonImg from 'Assets/chains/polygon.jpeg';
import ultronImg from 'Assets/chains/ultron.jpeg';
import qImg from 'Assets/chains/q.svg';
import auroraImg from 'Assets/chains/aurora.png';
import lineaImg from 'Assets/chains/linea.svg';
import bitfinityImg from 'Assets/chains/bitfinity.svg';

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
    ...sepolia,
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
    id: 35441,
    name: 'Q chain',
    network: 'Q chain',
    nativeCurrency: {
      name: 'Q',
      symbol: 'Q',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.q.org']
      },
      public: {
        http: ['https://rpc.q.org']
      },
    }, 
    blockExplorers: {
      default: {
        name: 'Explorer Q', 
        url: 'https://explorer.q.org',
      },
    }, 
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
  {
    id: 1313161554,
    name: 'Aurora',
    network: 'Aurora',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.orally.network/?rpc=https://aurora-mainnet.infura.io/v3/4621bacc25114af6b6400009c55f6a9e']
      },
      public: {
        http: ['https://rpc.orally.network/?rpc=https://aurora-mainnet.infura.io/v3/4621bacc25114af6b6400009c55f6a9e']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Aurora',
        url: 'https://aurorascan.dev',
      },
    },
    img: auroraImg,
  },
  {
    id: 59140,
    name: 'Linea Testnet',
    network: 'Linea testnet',
    nativeCurrency: {
      name: 'Linea ETH',
      symbol: 'LETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.goerli.linea.build']
      },
      public: {
        http: ['https://rpc.goerli.linea.build']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Linea Testnet',
        url: 'https://explorer.goerli.linea.build',
      },
    },
    testnet: true,
    img: lineaImg,
  },
  {
    id: 355113,
    name: 'Bitfinity Testnet',
    network: 'Bitfinity testnet',
    nativeCurrency: {
      name: 'BFT',
      symbol: 'BFT',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://testnet.bitfinity.network/']
      },
      public: {
        http: ['https://testnet.bitfinity.network/']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Bitfinity Testnet',
        url: '',
      },
    },
    testnet: true,
    img: bitfinityImg,
  },
];

export const CHAINS_MAP = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain;

  return acc;
}, {});

export default CHAINS;
