import React from 'react';
import cn from 'classnames';

import styles from './Button.scss';

const Button = ({ disabled = false, children, onClick, className }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn([styles.button, className])}
    >
      {children}
    </button>
  )
};

export default Button;
