export const RAND_METHOD_TYPES = ["string", "bytes64", "bytes256", "uint64", "uint256", "int64", "int256"];

export const mapChainsToOptions = (chains) => {
  return chains.map((chain) => ({
    value: chain.chain_id,
    label: chain.chain_id,
  }));
};

export const mapPairsToOptions = (pairs) => {
  return pairs.map((pair) => ({
    value: pair.id,
    label: pair.id,
  }));
};

export const getStrMethodArgs = (isFeed) => {
  return isFeed ? "string, uint256, uint256, uint256" : "";
};
