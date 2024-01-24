import { Button, Flex, Space } from 'antd';
import React from 'react';
import styles from './Demo.scss';

export const Actions = () => {
  return (
    <Flex align="center" gap="small">
      <Flex vertical>
        <span>My winnings</span>
        {/* fetch and replace with balance and symbol */}
        <span className={styles.accentText}>0.00 ETH</span>
      </Flex>
      <Button type="primary" onClick={() => {}}>
        Withdraw
      </Button>
    </Flex>
  );
};
