import React, { ReactNode } from 'react';
import cn from 'classnames';
import { Button as AntdButton } from 'antd';

import styles from './Button.scss';
import { ButtonProps as AntdButtonProps, ButtonType } from 'antd/es/button';

interface ButtonProps extends AntdButtonProps {
  disabled?: boolean;
  children?: ReactNode | string;
  onClick?: () => void;
  className?: string;
  type?: ButtonType;
}

const Button = ({ disabled = false, children, onClick, className, type }: ButtonProps) => {
  return (
    <AntdButton
      disabled={disabled}
      onClick={onClick}
      className={cn([styles.button, className])}
      type={type}
    >
      {children}
    </AntdButton>
  );
};

export default Button;
