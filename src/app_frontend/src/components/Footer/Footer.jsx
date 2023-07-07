import React from "react";
import { Outlet } from "react-router-dom";
import { Layout, Button } from "antd";

import GitIcon from "Assets/git.svg";
import GitbookIcon from "Assets/gitbook.svg";
import TwitterIcon from "Assets/twitter.svg";
import onChainLogo from "Assets/onChain.png";

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
      <img src={onChainLogo} className={styles.logo} />
    </Layout.Footer>
  );
};

export default Footer;
