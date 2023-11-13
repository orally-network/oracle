import { Unit } from "Interfaces/subscription";

export const RAND_METHOD_TYPES = ["string", "bytes64", "bytes256", "uint64", "uint256", "int64", "int256"];

export const mapChainsToOptions = (chains: any) => {
  return chains.map((chain: any ) => ({
    value: chain.chain_id,
    label: chain.chain_id,
  }));
};

export const mapPairsToOptions = (pairs: any) => {
  return pairs.map((pair: any) => ({
    value: pair.id,
    label: pair.id,
  }));
};

export const getStrMethodArgs = (isFeed: boolean) => {
  return isFeed ? "string, uint256, uint256, uint256" : "";
};


export const convertFrequencyToSeconds = (frequency: number, unit: Unit) => {
  let seconds = 30; // minimum 30 min
  switch (unit) {
    case 'min':
      seconds = frequency > seconds ? Number(frequency) * 60 : seconds * 60;
      break;
    case 'hour':
      seconds = Number(frequency) * 60 * 60;
      break;
    case 'day':
      seconds = Number(frequency) * 24 * 60 * 60;
      break;
    case 'week':
      seconds = Number(frequency) * 24 * 60 * 60 * 7;
      break;
    case 'month':
      seconds = Number(frequency) * 24 * 60 * 60 * 7 * 30.5; // 30.5 ~month
      break;
    default:
      seconds = Number(seconds) * 60;
  }
  if (seconds > MAX_FREQUENCY) {
    seconds = MAX_FREQUENCY;
  }
  return seconds;
};