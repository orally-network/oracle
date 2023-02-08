import { mainnet, goerli, polygon, polygonMumbai } from 'wagmi/chains';

import ethereumImg from 'Assets/chains/ethereum.jpeg';
import polygonImg from 'Assets/chains/polygon.jpeg';
import ultronImg from 'Assets/chains/ultron.jpeg';

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
    img: ultronImg,
    nativeCurrency: {
      symbol: 'ULX',
    },
  },
  {
    id: 1230,
    name: 'Ultron Testnet',
    img: ultronImg,
    nativeCurrency: {
      symbol: 'TULX',
    },
  },
];

export const CHAINS_MAP = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain;

  return acc;
}, {});

export default CHAINS;
