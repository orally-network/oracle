import ethereumImg from 'Assets/chains/ethereum.jpeg';
import polygonImg from 'Assets/chains/polygon.jpeg';
import ultronImg from 'Assets/chains/ultron.jpeg';

const CHAINS = [
  {
    id: 1,
    name: 'Ethereum',
    img: ethereumImg,
    coin: 'ETH',
  },
  {
    id: 5,
    name: 'Goerli',
    img: ethereumImg,
    coin: 'GoerliETH',
  },
  {
    id: 137,
    name: 'Polygon',
    img: polygonImg,
    coin: 'MATIC',
  },
  {
    id: 80001,
    name: 'Mumbai',
    img: polygonImg,
    coin: 'MumbaiMATIC',
  },
  {
    id: 1231,
    name: 'Ultron',
    img: ultronImg,
    coin: 'ULX',
  },
  {
    id: 1230,
    name: 'Ultron Testnet',
    img: ultronImg,
    coin: 'TULX',
  },
];

export const CHAINS_MAP = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain;

  return acc;
}, {});

export default CHAINS;
