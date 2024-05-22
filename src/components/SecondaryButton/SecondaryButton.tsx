import React, { ReactNode } from 'react';
import cn from 'classnames';
import { Button as AntdButton } from 'antd';

import styles from './SecondaryButton.module.scss';
import { ButtonProps as AntdButtonProps } from 'antd/es/button';

interface SecondaryButtonProps extends AntdButtonProps {
  children?: ReactNode | string;
  onClick?: () => void;
}

export const SecondaryButton = ({ children, ...props }: SecondaryButtonProps) => {
  return (
    <AntdButton className={styles.button} {...props}>
      {children}
    </AntdButton>
  );
};
