import React from 'react';
import { Button, Layout } from 'antd';

import gitLogoSrc from 'Assets/git.svg';
import gitbookLogoSrc from 'Assets/gitbook.svg';
import icpLogoSrc from 'Assets/icp.png';
import twitterLogoSrc from 'Assets/twitter.svg';

import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <Layout.Footer className={styles.container}>
      <Button className={styles.logoBtn} type="link" target="_blank"
              href="https://internetcomputer.org/ecosystem?tag=Tools+%2F+Infrastructure">
        <img src={icpLogoSrc} alt="100% on-chain: Internet Computer" className={styles.logo}/>
      </Button>
      <div className={styles.social}>
        <Button
          type="link"
          target="_blank"
          href="https://github.com/orally-network"
        >
          <img src={gitLogoSrc} alt="git icon"/>
        </Button>
        <Button
          type="link"
          target="_blank"
          href="https://twitter.com/orally_network"
        >
          <img src={twitterLogoSrc} alt="twitter icon"/>
        </Button>
        <Button type="link" target="_blank" href="https://docs.orally.network/">
          <img src={gitbookLogoSrc} alt="gitbook icon"/>
        </Button>
      </div>
    </Layout.Footer>
  );
};

export default Footer;
