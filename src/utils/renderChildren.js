import { Children, isValidElement, cloneElement } from 'react';

import omitBy from 'Utils/omitBy';
import isUndefined from 'Utils/isUndefined';

const EMPTY = {};

const renderChildren = (children, props = EMPTY) => {
  const cleanedProps = omitBy({ ...props }, isUndefined);

  if (typeof children === 'function') {
    return children(cleanedProps);
  }

  return Children.map(children, (child) => {
    return isValidElement(child) ? cloneElement(child, cleanedProps) : child;
  });
};

export default renderChildren;
