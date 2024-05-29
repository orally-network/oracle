import React from 'react';

import styles from './IconLinks.module.scss';

const IconLink = ({ link, IconComponent, ...rest }) => {
  return (
    link ? (
    <a
      className={styles.iconLink}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      <IconComponent />
    </a>
    ) : (
      <div className={styles.iconLink} {...rest}>
        <IconComponent />
      </div>
    )
  );
};

export default IconLink;