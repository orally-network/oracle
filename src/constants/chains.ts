import {
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  sepolia,
  zkSync,
  arbitrum,
  arbitrumNova,
  zkSyncSepoliaTestnet,
  linea,
  qMainnet,
  qTestnet,
  aurora,
  auroraTestnet,
  lineaTestnet,
  base,
  Chain,
} from 'wagmi/chains';
import { ExplorerType } from 'Interfaces/chain';
// import config from 'Constants/config';

const ethereumImg = '/assets/chains/ethereum.jpeg';
const polygonImg = '/assets/chains/polygon.jpeg';
const ultronImg = '/assets/chains/ultron.jpeg';
const qImg = '/assets/chains/q.svg';
const auroraImg = '/assets/chains/aurora.png';
const arbitrumNovaImg = '/assets/chains/arbitrum-nova.png';
const lineaImg = '/assets/chains/linea.svg';
const bitfinityImg = '/assets/chains/bitfinity.svg';
const taikoImg = '/assets/chains/taiko.svg';
const zkSyncImg = '/assets/chains/zkSync.png';
const artheraImg = '/assets/chains/arthera.png';
const mantaImg = '/assets/chains/manta.png';
const blastImg = '/assets/chains/blast.png';
const arbitrumImg = '/assets/chains/arbitrum.png';
const zircuitImg = '/assets/chains/zircuit.png';
const baseImg = '/assets/chains/base.svg';

type EnhancedChain = Chain & {
  img: string;
  explorerType?: string;
  explorerAddress?: string;
  fromBlock?: number;
  multicallAddress?: string;
  network?: string;
  isBlockscoutExplorer?: boolean;
};

const CHAINS: EnhancedChain[] = [
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
    ...base,
    img: baseImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    ...sepolia,
    rpcUrls: {
      default: {
        http: [
          'https://endpoints.omniatech.io/v1/eth/sepolia/public',
          'https://ethereum-sepolia-rpc.publicnode.com',
          'https://ethereum-sepolia.rpc.subquery.network/public',
          'https://rpc.sepolia.org',
        ],
      },
    },
    // rpcUrls: {
    //   default: {
    //     http: [`https://sepolia.infura.io/v3/${config.INFURA_API_KEY}`],
    //   },
    // },
    fromBlock: 6071603,
    img: ethereumImg,
    explorerType: ExplorerType.ScanExplorer,
    multicallAddress: '0x15EAc62512C24Ad46988a838b2c8ACa4Dce2aE26',
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
    ...zkSyncSepoliaTestnet,
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
        http: ['https://ultron-rpc.net'],
      },
      public: {
        http: ['https://ultron-rpc.net'],
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
        http: ['https://ultron-dev.io'],
      },
      public: {
        http: ['https://ultron-dev.io'],
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
    ...qTestnet,
    img: qImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    ...qMainnet,
    img: qImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    ...auroraTestnet,
    img: auroraImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    ...aurora,
    img: auroraImg,
    explorerType: ExplorerType.ScanExplorer,
  },
  {
    ...lineaTestnet,
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
        http: ['https://testnet.bitfinity.network/'],
      },
      public: {
        http: ['https://testnet.bitfinity.network/'],
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
        http: ['https://rpc.test.taiko.xyz'],
      },
      public: {
        http: ['https://rpc.test.taiko.xyz'],
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
        http: ['https://rpc.jolnir.taiko.xyz'],
      },
      public: {
        http: ['https://rpc.jolnir.taiko.xyz'],
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
        http: ['https://rpc.katla.taiko.xyz/'],
      },
      public: {
        http: ['https://rpc.katla.taiko.xyz/'],
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
    ...linea,
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
        http: ['https://rpc.l3test.taiko.xyz'],
      },
      public: {
        http: ['https://rpc.l3test.taiko.xyz'],
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
        http: ['https://rpc-test.arthera.net'],
      },
      public: {
        http: ['https://rpc-test.arthera.net'],
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
        http: ['https://rpc.arthera.net'],
      },
      public: {
        http: ['https://rpc.arthera.net'],
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
        http: ['https://pacific-rpc.testnet.manta.network/http'],
      },
      public: {
        http: ['https://pacific-rpc.testnet.manta.network/http'],
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
        http: ['https://pacific-rpc.manta.network/http'],
      },
      public: {
        http: ['https://pacific-rpc.manta.network/http'],
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
  {
    id: 48899,
    name: 'Zircuit Sepolia',
    network: 'Zircuit Sepolia',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://zircuit1.p2pify.com/'],
      },
      public: {
        http: ['https://zircuit1.p2pify.com/'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer Zircuit Sepolia',
        url: 'https://explorer.zircuit.com/',
      },
    },
    img: zircuitImg,
    explorerType: ExplorerType.ScanExplorer,
    multicallAddress: '0x8B2B8E6e8bF338e6071E6Def286B8518B7BFF7F1',
  },
];

export const CHAINS_MAP = CHAINS.reduce((acc, chain) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  acc[chain.id] = chain;

  return acc;
}, {});

export default CHAINS;
