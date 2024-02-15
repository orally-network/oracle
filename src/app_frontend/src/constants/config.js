const isDevelopment = false; // process.env.NODE_ENV === 'development'
const isStaging = process.env.MODE === 'staging';

const HOST = 'https://ic0.app';
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
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,

  THE_GRAPH_URL: process.env.THE_GRAPH_URL,

  pythia_canister_id: isStaging ? 'xmz4o-gqaaa-aaaag-qcjva-cai' : 'ettff-uaaaa-aaaag-abpcq-cai',
  sybil_canister_id: isStaging ? 'tysiw-qaaaa-aaaak-qcikq-cai' : 'wth3l-tiaaa-aaaap-aa5uq-cai',

  weatherSource1Key: process.env.WEATHER_SOURCE_1_KEY,
  weatherSource2Key: process.env.WEATHER_SOURCE_2_KEY,
  weatherSource3Key: process.env.WEATHER_SOURCE_3_KEY,
};
