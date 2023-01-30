import React, { useMemo } from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';

import Card from 'Components/Card';
import Button from 'Components/Button';
import { CHAINS_MAP } from 'Constants/chains';
import { createActor as createOracleActor } from 'Declarations/oracle';

import styles from './Oracle.scss';

const Oracle = ({ payload, canister_id }) => {
  console.log(payload, CHAINS_MAP[payload.chain_id], canister_id);

  const chain = CHAINS_MAP[payload.chain_id];

  const { address } = useAccount();
  const { chain: currentChain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const oracle = useMemo(() => createOracleActor(canister_id), [canister_id]);

  return (
    <Card className={styles.oracle}>
      <div className={styles.header}>
        <div className={styles.chain}>
          <img src={chain.img} alt={chain.name} />

          <div>{chain.name}</div>
        </div>

        <div className={styles.frequency}>
          {Number(payload.frequency) / 60} mins
        </div>
      </div>

      <div className={styles.endpoints}>
        <div className={styles.label}>
          Sources
        </div>

        {payload.endpoints.map((endpoint, index) => (
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
          {new URL(payload.rpc).hostname}
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

        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        console.log({ message, signature, oracle })

        // verify signature
        const a = await oracle.verify_address(message.prepareMessage(), signature.slice(2));
        console.log({a });
      }}>
        Do some shit
      </Button>
    </Card>
  );
};

export default Oracle;
