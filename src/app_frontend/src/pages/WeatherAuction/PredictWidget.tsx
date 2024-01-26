import { writeContract } from '@wagmi/core';
import { Space, Typography, Input, Card, Flex } from 'antd';
import Button from 'Components/Button';
import React, { useState } from 'react';
import WeatherAuctionABI from './weatherAuctionABI.json';
import { utils } from 'ethers';
import { CHAINS_MAP } from 'Constants/chains';

const WEATHER_AUCTION_ADDRESS = '0x8B2B8E6e8bF338e6071E6Def286B8518B7BFF7F1';
const TICKET_PRICE = 0.001;
const ARBITRUM_CHAIN_ID = 42161;

// TODO: implement this widget, connect it to the smart contract

export const PredictWidget = () => {
  const [temperatureGuess, setTemperatureGuess] = useState<string>('');
  const [ticketAmount, setTicketAmount] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const sendAuctionData = async () => {
    const formattedTemperatureGuess = +temperatureGuess.replace('.', '');

    return writeContract({
      address: WEATHER_AUCTION_ADDRESS,
      abi: WeatherAuctionABI,
      value: utils.parseUnits(
        String(TICKET_PRICE * (ticketAmount ? +ticketAmount : 1)),
        CHAINS_MAP[ARBITRUM_CHAIN_ID].nativeCurrency.decimals
      ), // amount of eth applied to transaction
      functionName: 'bid',
      args: [formattedTemperatureGuess], // in format with decimals=1, e.g. 16.6C = 166
      chainId: ARBITRUM_CHAIN_ID,
    });
  };

  const makeBidAndVerify = async () => {
    setIsConfirming(true);
    try {
      const { hash } = await sendAuctionData();
      console.log({ hash });
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Card>
      <Flex gap="large" vertical>
        <Typography.Title level={5}>How much degree will be today at 17:00? </Typography.Title>
        <Flex gap="large" align="center">
          <Flex vertical gap="middle">
            <div>Write the weather degree</div>
            <Space size="middle">
              <Input
                value={temperatureGuess}
                placeholder="20℃ or 16.6℃"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTemperatureGuess(e.target.value)
                }
                style={{ width: '133px' }}
              />
              <Input
                value={ticketAmount}
                placeholder="Ticket amount"
                type="number"
                min="1"
                max="100"
                style={{ width: '133px' }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTicketAmount(e.target.value)
                }
              />
            </Space>
            <Button
              type="primary"
              onClick={makeBidAndVerify}
              loading={isConfirming}
              disabled={!temperatureGuess}
            >
              Bid
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
