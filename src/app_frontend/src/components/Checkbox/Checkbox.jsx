import React, { forwardRef } from 'react';
import cn from 'classnames';

import styles from './Checkbox.scss';

const Checkbox = forwardRef(({ className, value, type = 'text', ...rest }, ref) => {
  return (
    <input
      className={cn([className, styles.input])}
      value={value}
      type={type}
      ref={ref}
      {...rest}
    />
  );
});

export default Checkbox;
