import React from 'react';
import cn from 'classnames';

import styles from './Card.scss';

const Card = ({ children, className }) => {
  return (
    <div className={cn([styles.card, className])}>
      {children}
    </div>
  )
};

export default Card;
