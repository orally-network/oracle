import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import Button from "Components/Button";
import { truncateEthAddress } from "Utils/addressUtils";

const Connect = ({ className }) => {
  const { open, close } = useWeb3Modal();

  return <w3m-button />;
};

export default Connect;
