import usdcSrc from 'Assets/coins/usdc.svg';
import usdtSrc from 'Assets/coins/usdt.svg';
import ethSrc from 'Assets/coins/eth.svg';

const usdc = {
  symbol: 'USDC',
  img: usdcSrc,
};

const usdt = {
  symbol: 'USDT',
  img: usdtSrc,
};

const eth = {
  symbol: 'ETH',
  img: ethSrc,
};

export const TOKENS_MAP = {
  // ethereum usdc
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': usdc,
  // arbitrum usdc
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831': usdc,
  // polygon usdc
  '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359': usdc,

  // ethereum usdt
  '0xdAC17F958D2ee523a2206206994597C13D831ec7': usdt,
  // arbitrum usdt
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': usdt,
  // polygon usdt
  '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': usdt,

  eth: eth,
};
