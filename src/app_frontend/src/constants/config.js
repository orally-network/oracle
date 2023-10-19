const isDevelopment = false; // process.env.NODE_ENV === 'development'
const isStaging = process.env.MODE === 'staging';

const HOST = isDevelopment ? 'http://127.0.0.1:4943' : 'https://ic0.app';
const DOMAIN = isDevelopment ? 'localhost:4943' : 'icp0.io';

export default {
  isDevelopment,
  isStaging,
  HOST,
  DOMAIN,
  GOOGLE_ANALYTICS_TRACKING_CODE: process.env.GOOGLE_ANALYTICS_TRACKING_CODE,
  ROLLBAR_ACCESS_TOKEN: process.env.ROLLBAR_ACCESS_TOKEN,
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  INFURA_API_KEY: process.env.INFURA_API_KEY,
  env: process.env.NODE_ENV,

  pythia_canister_id: isStaging ? 'xmz4o-gqaaa-aaaag-qcjva-cai' : 'ettff-uaaaa-aaaag-abpcq-cai',
  sybil_canister_id: isStaging ? 'tysiw-qaaaa-aaaak-qcikq-cai' : 'wth3l-tiaaa-aaaap-aa5uq-cai',
};
