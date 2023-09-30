import React from "react";
import { Layout, Button } from "antd";

import GitIcon from "Assets/git.svg";
import GitbookIcon from "Assets/gitbook.svg";
import TwitterIcon from "Assets/twitter.svg";
import icpLogo from "Assets/icp.png";

import styles from "./Footer.scss";

const Footer = () => {
  return (
    <Layout.Footer className={styles.container}>
      <div>
        <Button
          type="link"
          target="_blank"
          href="https://github.com/orally-network"
        >
          <GitIcon />
        </Button>
        <Button
          type="link"
          target="_blank"
          href="https://twitter.com/orally_network"
        >
          <TwitterIcon />
        </Button>
        <Button type="link" target="_blank" href="https://docs.orally.network/">
          <GitbookIcon />
        </Button>
      </div>
      
      <Button type="link" target="_blank" href="https://internetcomputer.org/ecosystem?tag=Tools+%2F+Infrastructure">
        <img src={icpLogo} alt="100% on-chain: Internet Computer" className={styles.logo} />
      </Button>
    </Layout.Footer>
  );
};

export default Footer;
