import React from 'react';
import cn from 'classnames';
import { Button as AntdButton } from 'antd';

import styles from './Button.scss';

const Button = ({ disabled = false, children, onClick, className, type }) => {
  return (
    <AntdButton
      disabled={disabled}
      onClick={onClick}
      className={cn([styles.button, className])}
      type={type}
    >
      {children}
    </AntdButton>
  )
};

export default Button;
