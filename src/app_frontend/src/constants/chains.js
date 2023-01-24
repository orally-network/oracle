import ethereumImg from 'Assets/chains/ethereum.jpeg';
import polygonImg from 'Assets/chains/polygon.jpeg';
import ultronImg from 'Assets/chains/ultron.jpeg';

const CHAINS = [
  {
    id: 1,
    name: 'Ethereum',
    img: ethereumImg,
  },
  {
    id: 5,
    name: 'Goerli',
    img: ethereumImg,
  },
  {
    id: 137,
    name: 'Polygon',
    img: polygonImg,
  },
  {
    id: 80001,
    name: 'Mumbai',
    img: polygonImg,
  },
  {
    id: 1231,
    name: 'Ultron',
    img: ultronImg,
  },
  {
    id: 1230,
    name: 'Ultron Testnet',
    img: ultronImg,
  },
];

export const CHAINS_MAP = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain;

  return acc;
}, {});

export default CHAINS;
