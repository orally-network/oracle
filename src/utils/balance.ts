export const BALANCE_USD_DECIMALS = 6; // USD decimals

export const parseBalance = (balance: number) => {
  return balance * Math.pow(10, BALANCE_USD_DECIMALS);
};

export const formatBalance = (balance: number) => {
  return balance / Math.pow(10, BALANCE_USD_DECIMALS);
};
