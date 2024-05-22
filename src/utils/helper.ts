import { MAX_FREQUENCY } from 'Constants/ui';
import { FrequencyType, Unit } from 'Interfaces/subscription';
import { TOKEN_IMAGES } from 'Constants/tokens';
import { CHAINS_MAP } from 'Constants/chains';

export const RAND_METHOD_TYPES = [
  'string',
  'bytes64',
  'bytes256',
  'uint64',
  'uint256',
  'int64',
  'int256',
];

export const mapChainsToOptions = (chains: any) => {
  return chains.map((chain: any) => ({
    value: chain.chain_id,
    label: chain.chain_id,
  }));
};

export const mapChainsToNewOptions = (chains: any) => {
  return chains.map((chain: any) => {
    const chainData = CHAINS_MAP[chain.chain_id];

    return {
      ...chain,
      key: chainData.id,
      label: chainData.name,
      value: chainData.id,
      avatar: chainData.img,
    }
  });
};

export const mapTokensToOptions = (tokens: any) => {
  return tokens.map((token: any) => ({
    ...token,
    key: token.address,
    label: token.symbol,
    value: token.address,
    avatar: TOKEN_IMAGES[token.symbol.toUpperCase()],
  }));
};

export const mapFeedsToOptions = (feeds: any) => {
  return feeds.map((feed: any) => ({
    value: feed.id,
    label: feed.id,
  }));
};

export const getStrMethodArgs = (isFeed: boolean) => {
  return isFeed ? 'string, uint256, uint256, uint256' : '';
};

export const convertFrequencyDate = (seconds: number): FrequencyType => {
  const secondsPerHour = 3600; // 60 seconds/minute * 60 minutes/hour
  const secondsPerDay = 86400; // 24 hours * 60 minutes * 60 seconds
  const secondsPerWeek = 604800; // 7 days * 24 hours * 60 minutes * 60 seconds
  const secondsPerMonth = 2628000; //Average number of seconds in a month (30.44 days)

  if (seconds > secondsPerMonth) {
    return {
      value: seconds / secondsPerMonth,
      units: 'month',
    };
  }

  if (seconds > secondsPerWeek) {
    return {
      value: seconds / secondsPerWeek,
      units: 'week',
    };
  }

  if (seconds > secondsPerDay) {
    return {
      value: seconds / secondsPerDay,
      units: 'day',
    };
  }

  if (seconds > secondsPerHour) {
    return {
      value: seconds / secondsPerHour,
      units: 'hour',
    };
  }

  return {
    value: seconds / 60,
    units: 'min',
  };
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
