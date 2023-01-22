import React, { useEffect } from 'react';
import ReactGA from 'react-ga';

import styles from './ErrorPage.scss';

const errors = {
  404: 'Page not found',
  any: 'Something went wrong',
};

const ErrorPage = ({ code }) => {
  useEffect(() => {
    ReactGA.pageview('/error-page');
  }, []);

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorLabel}>{errors[code] ?? errors.any}</div>
    </div>
  );
};

export default ErrorPage;
