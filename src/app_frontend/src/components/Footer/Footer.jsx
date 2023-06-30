import React from "react";
import { Outlet } from "react-router-dom";
import { Layout, Button } from "antd";

import GitIcon from "Assets/git.svg";
import GitbookIcon from "Assets/gitbook.svg";
import TwitterIcon from "Assets/twitter.svg";

import styles from "./Footer.scss";

const Footer = () => {
  return (
    <Layout.Footer className={styles.container}>
      <Button
        type="link"
        target="_blank"
        href="https://github.com/orally-network"
      >
        <GitIcon className={styles.icon} />
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
    </Layout.Footer>
  );
};

export default Footer;
