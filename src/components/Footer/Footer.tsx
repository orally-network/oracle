import React from 'react';
import { Button, Layout } from 'antd';

import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <Layout.Footer className={styles.container}>
      <Button className={styles.logoBtn} type="link" target="_blank"
              href="https://internetcomputer.org/ecosystem?tag=Tools+%2F+Infrastructure">
        <img src="/assets/icp.png" alt="100% on-chain: Internet Computer" className={styles.logo}/>
      </Button>
      <div className={styles.social}>
        <Button
          type="link"
          target="_blank"
          href="https://github.com/orally-network"
        >
          <img src="/assets/git.svg" alt="git icon"/>
        </Button>
        <Button
          type="link"
          target="_blank"
          href="https://twitter.com/orally_network"
        >
          <img src="/assets/twitter.svg" alt="twitter icon"/>
        </Button>
        <Button type="link" target="_blank" href="https://docs.orally.network/">
          <img src="/assets/gitbook.svg" alt="gitbook icon"/>
        </Button>
      </div>
    </Layout.Footer>
  );
};

export default Footer;
