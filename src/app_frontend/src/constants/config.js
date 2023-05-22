import { canisterId as oracleFactoryCanisterId } from '../../../declarations/oracle_factory';

const isDevelopment = process.env.NODE_ENV === 'development';

const HOST = isDevelopment ? 'http://127.0.0.1:4943' : 'https://mainnet.dfinity.network';
const DOMAIN = isDevelopment ? 'localhost:4943' : 'ic0.app';

export default {
  oracleFactoryCanisterId,
  isDevelopment,
  HOST,
  DOMAIN,
  GOOGLE_ANALYTICS_TRACKING_CODE: process.env.GOOGLE_ANALYTICS_TRACKING_CODE,
  ROLLBAR_ACCESS_TOKEN: process.env.ROLLBAR_ACCESS_TOKEN,
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  INFURA_API_KEY: process.env.INFURA_API_KEY,
  env: process.env.NODE_ENV,
  
  pythia_canister_id: isDevelopment ? 'be2us-64aaa-aaaaa-qaabq-cai' : '',
  sybil_canister_id: isDevelopment ? 'b77ix-eeaaa-aaaaa-qaada-cai' : '',
};
