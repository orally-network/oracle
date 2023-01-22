export default {
  log(...args) {
    console.log(...args);

    // window.rollbar.log(...args);
  },
  error(...args) {
    console.error(...args);

    const [error, ...details] = args;

    window.rollbar.error(error, { ...details });
  },
  critical(error, scope) {
    console.error(error, scope);

    window.rollbar.error(error, { scope });
  },
  warn(...args) {
    console.warn(...args);

    window.rollbar.warn(...args);
  },
};
