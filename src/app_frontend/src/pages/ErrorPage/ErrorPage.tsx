import React from 'react';

import styles from './ErrorPage.scss';
import { useRouteError } from 'react-router-dom';

const errors = {
  404: 'Page not found',
  any: 'Something went wrong',
};

const ErrorPage = () => {
  const error: any = useRouteError();

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorLabel}>{errors[error.status] ?? errors.any}</div>
    </div>
  );
};

export default ErrorPage;
