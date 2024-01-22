import { mainnet, goerli, polygon, polygonMumbai, sepolia, zkSync, zkSyncTestnet, arbitrum, arbitrumNova } from 'wagmi/chains';

import ethereumImg from 'Assets/chains/ethereum.jpeg';
import polygonImg from 'Assets/chains/polygon.jpeg';
import ultronImg from 'Assets/chains/ultron.jpeg';
import qImg from 'Assets/chains/q.svg';
import auroraImg from 'Assets/chains/aurora.png';
import arbitrumNovaImg from 'Assets/chains/arbitrum-nova.png';
import lineaImg from 'Assets/chains/linea.svg';
import bitfinityImg from 'Assets/chains/bitfinity.svg';
import taikoImg from 'Assets/chains/taiko.svg';
import zkSyncImg from 'Assets/chains/zkSync.png';
import artheraImg from 'Assets/chains/arthera.png';
import mantaImg from 'Assets/chains/manta.png';
import blastImg from 'Assets/chains/blast.png';
import arbitrumImg from 'Assets/chains/arbitrum.png';
import { ExplorerType } from 'Interfaces/chain';

const CHAINS = [
  {
    ...mainnet,
    img: ethereumImg,
    explorerType: ExplorerType.ScanExplorer,
    explorerAddress: 'https://api.etherscan.io',
  },
  {
    ...goerli,
    img: ethereumImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    ...sepolia,
    img: ethereumImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    ...arbitrum,
    img: arbitrumImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    ...arbitrumNova,
    img: arbitrumNovaImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    ...polygon,
    img: polygonImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    ...polygonMumbai,
    img: polygonImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    ...zkSync,
    img: zkSyncImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    ...zkSyncTestnet,
    img: zkSyncImg,
    explorerType: ExplorerType.ScanExplorer,
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
    explorerType: ExplorerType.ScanExplorer,
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
    explorerType: ExplorerType.ScanExplorer,
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
    explorerType: ExplorerType.ScanExplorer,
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
        http: ['https://mainnet.aurora.dev']
      },
      public: {
        http: ['https://mainnet.aurora.dev']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Aurora',
        url: 'https://aurorascan.dev',
      },
    },
    img: auroraImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    id: 59140,
    name: 'Linea Testnet',
    network: 'Linea testnet',
    nativeCurrency: {
      name: 'Linea ETH',
      symbol: 'ETH',
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
        url: 'https://goerli.lineascan.build/',
      },
    },
    testnet: true,
    img: lineaImg,
    explorerType: ExplorerType.ScanExplorer,
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
  {
    id: 167005,
    name: 'Taiko Grimsvotn L2',
    network: 'Taiko Grimsvotn L2',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.test.taiko.xyz']
      },
      public: {
        http: ['https://rpc.test.taiko.xyz']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Taiko Grimsvotn L2',
        url: 'https://explorer.test.taiko.xyz',
      },
    },
    testnet: true,
    img: taikoImg,
    isBlockscoutExplorer: true,
  },
  {
    id: 167007,
    name: 'Taiko Jolnir L2',
    network: 'Taiko Jolnir L2',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.jolnir.taiko.xyz']
      },
      public: {
        http: ['https://rpc.jolnir.taiko.xyz']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Taiko Jolnir L2',
        url: 'https://explorer.jolnir.taiko.xyz/',
      },
    },
    testnet: true,
    img: taikoImg,
    isBlockscoutExplorer: true,
    explorerType: ExplorerType.BlockscoutExplorer,
  },
  {
    id: 167008,
    name: 'Taiko Katla',
    network: 'Taiko Katla',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.katla.taiko.xyz/']
      },
      public: {
        http: ['https://rpc.katla.taiko.xyz/']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Taiko Katla',
        url: 'https://explorer.katla.taiko.xyz/',
      },
    },
    testnet: true,
    img: taikoImg,
    isBlockscoutExplorer: true,
    explorerType: ExplorerType.BlockscoutExplorer,
  },
  {
    id: 59144,
    name: 'Linea Mainnet',
    network: 'Linea Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://linea-mainnet.infura.io/v3/{key}']
      },
      public: {
        http: ['https://linea-mainnet.infura.io/v3/{key}']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Linea Mainnet',
        url: 'https://explorer.linea.build/',
      },
    },
    img: lineaImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    id: 167006,
    name: 'Taiko Eldfell L3',
    network: 'Taiko Eldfell L3',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.l3test.taiko.xyz']
      },
      public: {
        http: ['https://rpc.l3test.taiko.xyz']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Taiko Alpha-3 Grimsvotn',
        url: 'https://explorer.l3test.taiko.xyz',
      },
    },
    testnet: true,
    img: taikoImg,
    isBlockscoutExplorer: true,
  },
  {
    id: 10243,
    name: 'Arthera Testnet',
    network: 'Arthera Testnet',
    nativeCurrency: {
      name: 'AA',
      symbol: 'AA',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc-test.arthera.net']
      },
      public: {
        http: ['https://rpc-test.arthera.net']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Arthera Testnet',
        url: 'https://explorer-test.arthera.net/',
      },
    },
    testnet: true,
    img: artheraImg,
    isBlockscoutExplorer: true,
  },
  {
    id: 10242,
    name: 'Arthera',
    network: 'Arthera',
    nativeCurrency: {
      name: 'AA',
      symbol: 'AA',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.arthera.net']
      },
      public: {
        http: ['https://rpc.arthera.net']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Arthera',
        url: 'https://explorer.arthera.net',
      },
    },
    img: artheraImg,
    isBlockscoutExplorer: true,
  },
  {
    id: 3441005,
    name: 'Manta Pacific Testnet',
    network: 'Manta Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://pacific-rpc.testnet.manta.network/http']
      },
      public: {
        http: ['https://pacific-rpc.testnet.manta.network/http']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Manta Pacific Testnet',
        url: 'https://pacific-explorer.testnet.manta.network',
      },
    },
    testnet: true,
    img: mantaImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    id: 169,
    name: 'Manta Pacific L2 Rollup',
    network: 'Manta Pacific L2 Rollup',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://pacific-rpc.manta.network/http']
      },
      public: {
        http: ['https://pacific-rpc.manta.network/http']
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Manta Pacific L2 Rollup',
        url: 'https://pacific-explorer.manta.network',
      },
    },
    img: mantaImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    id: 168587773,
    name: 'Blast Sepolia',
    network: 'Blast Sepolia',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://sepolia.blast.io'],
      },
      public: {
        http: ['https://sepolia.blast.io'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Blast Sepolia',
        url: 'https://testnet.blastscan.io',
      },
    },
    img: blastImg,
    explorerType: ExplorerType.ScanExplorer,
  },
];

export const CHAINS_MAP = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain;

  return acc;
}, {});

export default CHAINS;
