import { Space, Typography, Input, Card, Flex } from 'antd';
import Button from 'Components/Button';
import React, { useState } from 'react';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { toast } from 'react-toastify';

// TODO: implement this widget, connect it to the smart contract

export const PredictWidget = () => {
  const [temperatureGuess, setTemperatureGuess] = useState<string>('');
  const [ticketAmount, setTicketAmount] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const { sendAuctionData } = useWeatherData();

  const makeBidAndVerify = async () => {
    setIsConfirming(true);
    try {
      const { hash } = await toast.promise(
        sendAuctionData(+temperatureGuess.replace('.', ''), +ticketAmount),
        {
          pending: 'Confirming transaction...',
          success: 'Transaction confirmed!',
          error: 'Transaction failed',
        }
      );
      console.log({ hash });
      // TODO: verify transaction
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
