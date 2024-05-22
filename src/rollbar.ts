import config from "Constants/config";

const ROLLBAR_CONFIG = {
  accessToken: config.ROLLBAR_ACCESS_TOKEN,
  enabled: config.env === 'production',
  itemsPerMinute: 10,
  verbose: config.isDevelopment,
  captureUncaught: true,
  captureUnhandledRejections: true,
  transmit: true,
  payload: {
    environment: config.env,
    client: {
      javascript: {
        guess_uncaught_frames: true,
        source_map_enabled: true,
        code_version: true,
      },
    },
    server: {
      branch: "master",
    },
  },
};

export default ROLLBAR_CONFIG;
