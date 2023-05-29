import React from 'react';

import styles from './IconLinks.scss';

const IconLink = ({ link, IconComponent }) => {
  return (
    <a
      className={styles.iconLink}
      href={link}
      target="_blank"
    >
      <IconComponent />
    </a>
  );
};

export default IconLink;