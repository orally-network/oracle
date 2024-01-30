import { Space, Typography, Input, Card, Flex } from 'antd';
import Button from 'Components/Button';
import React, { useEffect, useState } from 'react';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { toast } from 'react-toastify';
import pythiaCanister from 'Canisters/pythiaCanister';
import { Subscription } from 'Interfaces/subscription';
import { ARBITRUM_CHAIN_ID } from 'Providers/WeatherAuctionData/WeatherAuctionProvider';
import { LoadingOutlined } from '@ant-design/icons';

export const PredictWidget = () => {
  const [temperatureGuess, setTemperatureGuess] = useState<string>('');
  const [ticketAmount, setTicketAmount] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const [subscriptionData, setSubscriptionData] = useState<Subscription | null>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState<boolean>(false);
  const [nextUpdateDateTime, setNextUpdateDateTime] = useState<string | null>(null);

  const { sendAuctionData, isAuctionOpen, getBids, currentDay } = useWeatherData();

  const fetchSubscription = async (id: BigInt, chainId: BigInt) => {
    try {
      setIsSubscriptionLoading(true);
      const response: any = await pythiaCanister.get_subscription(chainId, id);
      if (response.Err) {
        setSubscriptionData(null);
        throw new Error(response.Err);
      } else {
        setSubscriptionData(response.Ok);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  const makeBidAndVerify = async () => {
    setIsConfirming(true);
    try {
      const { hash } = await toast.promise(sendAuctionData(+temperatureGuess * 10, +ticketAmount), {
        pending: 'Confirming transaction...',
        success: 'Transaction confirmed!',
        error: 'Transaction failed',
      });
      console.log({ hash });
      getBids({ variables: { day: currentDay } });
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirming(false);
    }
  };

  useEffect(() => {
    if (isAuctionOpen) {
      fetchSubscription(BigInt(57), BigInt(ARBITRUM_CHAIN_ID));
    } else {
      fetchSubscription(BigInt(59), BigInt(ARBITRUM_CHAIN_ID));
    }
  }, [isAuctionOpen]);

  useEffect(() => {
    if (!subscriptionData) return;
    const {
      method: { exec_condition },
      status: { last_update },
    } = subscriptionData as Subscription;

    const frequency = exec_condition[0]?.Frequency || BigInt(3600);

    const lastUpdateDateTime = new Date(Number(last_update) * 1000);
    const nextUpdateDateTime = new Date(lastUpdateDateTime.getTime() + Number(frequency) * 1000);

    setNextUpdateDateTime(nextUpdateDateTime.toLocaleString());
  }, [subscriptionData]);

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
            <Typography.Text>
              {isAuctionOpen
                ? 'Auction will close in '
                : 'Auction closed, winner will be chosen in '}
              <strong>
                {isSubscriptionLoading || !nextUpdateDateTime ? (
                  <LoadingOutlined />
                ) : (
                  nextUpdateDateTime
                )}
              </strong>
            </Typography.Text>
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
