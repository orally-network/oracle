import React, { PureComponent } from 'react';

import ErrorPage from 'Pages/ErrorPage';
import renderChildren from 'Utils/renderChildren';
import logger from 'Utils/logger';

class ErrorBoundary extends PureComponent {
  static getDerivedStateFromError(error) {
    return {
      error,
      hasError: true,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  componentDidMount() {
    window.onerror = (err, other) => {
      logger.error(err, other);
    };
  }

  componentDidCatch(error) {
    const { silent = false } = this.props;

    if (silent) {
      return;
    }

    const { scope } = this.props;

    logger.critical(error, scope);
  }

  onRecover = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const { children, fallback = <ErrorPage /> } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      return renderChildren(fallback, {
        error,
        onRecover: this.onRecover,
      });
    }

    return children;
  }
}

export default ErrorBoundary;
