import React, { useState } from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';

import Card from 'Components/Card';
import Button from 'Components/Button';

import styles from './Oracle.scss';

const Oracle = ({ oracleId, fetcher, chain, oracle, rpc, subscriptions, chain_id, factory_address }) => {
  console.log({oracleId, fetcher, chain, subscriptions, chain_id, factory_address });

  const { address } = useAccount();
  const { chain: currentChain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const [message, setMessage] = useState(null);
  const [signature, setSignature] = useState(null);

  return (
    <Card className={styles.oracle}>
      <div className={styles.header}>
        <div className={styles.chain}>
          <img src={chain.img} alt={chain.name} />

          <div>{chain.name}</div>
        </div>

        <div className={styles.frequency}>
          {(Number(fetcher.frequency) / 60).toFixed(2)} mins
        </div>
      </div>

      <div className={styles.endpoints}>
        <div className={styles.label}>
          Sources
        </div>

        {fetcher.endpoints.map((endpoint, index) => (
          <div key={index} className={styles.endpoint}>
            {endpoint.url}
          </div>
        ))}
      </div>

      <div className={styles.rpcWrapper}>
        <div className={styles.label}>
          Rpc
        </div>

        <div className={styles.rpc}>
          {new URL(rpc).hostname}
        </div>
      </div>

      <Button onClick={async () => {
        // get nonce

        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to the oracle.',
          uri: window.location.origin,
          version: '1',
          chainId: currentChain?.id,
          // nonce: 0,
        });

        setMessage(message.prepareMessage());

        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        setSignature(signature.slice(2));

        console.log({ message, signature, oracle })

        // verify signature
        const a = await oracle.verify_address(message.prepareMessage(), signature.slice(2));
        console.log({a });
      }}>
        Verify - get address
      </Button>

      <Button onClick={async () => {
        const res = await oracle.subscribe('0xCFf00E5f685cCE94Dfc6d1a18200c764f9BCca1f', 'set_price', message, signature);

        console.log({res });
      }}>
        Subscribe
      </Button>

      <Button>
        Top up wallet
      </Button>
    </Card>
  );
};

export default Oracle;
