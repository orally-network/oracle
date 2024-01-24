import { Space, Typography, Input, Card, Flex, Button } from 'antd';
import React, { useState } from 'react';

// TODO: implement this widget, connect it to the smart contract

export const PredictWidget = () => {
  const [degree, setDegree] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  return (
    <Card>
      <Flex gap="large" vertical>
        <Typography.Title level={5}>How much degree will be today at 17:00? </Typography.Title>
        <Flex gap="large" align="center">
          <Flex vertical gap="middle">
            <div>Write the weather degree</div>
            <Space size="middle">
              <Input
                value={degree}
                placeholder="20℃"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDegree(e.target.value)}
                style={{ width: '133px' }}
              />
              <Input
                value={amount}
                placeholder="Ticket amount"
                type="number"
                min="1"
                max="100"
                style={{ width: '133px' }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              />
            </Space>
            <Button type="primary" onClick={() => {}}>
              Verify
            </Button>
          </Flex>
          <div>
            There might be few winners in one auction. <br />
            The more tickets you buy, the higher chance you win.
          </div>
        </Flex>
      </Flex>
    </Card>
  );
};
