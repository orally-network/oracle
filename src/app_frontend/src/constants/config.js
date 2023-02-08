import { canisterId as oracleFactoryCanisterId } from '../../../declarations/oracle_factory';

const isDevelopment = process.env.NODE_ENV === 'development';

const HOST = isDevelopment ? 'http://127.0.0.1:8000' : 'https://mainnet.dfinity.network';

export default {
  oracleFactoryCanisterId,
  isDevelopment,
  HOST,
  GOOGLE_ANALYTICS_TRACKING_CODE: process.env.GOOGLE_ANALYTICS_TRACKING_CODE,
  ROLLBAR_ACCESS_TOKEN: process.env.ROLLBAR_ACCESS_TOKEN,
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  INFURA_API_KEY: process.env.INFURA_API_KEY,
  env: process.env.NODE_ENV,
};
