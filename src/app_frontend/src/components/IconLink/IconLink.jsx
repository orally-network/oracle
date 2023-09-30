import React from 'react';

import styles from './IconLinks.scss';

const IconLink = ({ link, IconComponent, ...rest }) => {
  return (
    <a
      className={styles.iconLink}
      href={link}
      target="_blank"
      {...rest}
    >
      <IconComponent />
    </a>
  );
};

export default IconLink;