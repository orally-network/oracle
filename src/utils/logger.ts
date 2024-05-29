import rollbar from "../rollbarSetup";

export default {
  log(...args) {
    console.log(...args);

    // window.rollbar.log(...args);
  },
  error(...args) {
    console.error(...args);

    const [error, ...details] = args;

    rollbar.error(error, { ...details });
  },
  critical(error, scope) {
    console.error(error, scope);

    rollbar.error(error, { scope });
  },
  warn(...args) {
    console.warn(...args);

    rollbar.warn(...args);
  },
};
