import { Typography } from 'antd';
import { formatBalance } from 'Utils/balance';
import { useFetchBalance } from 'Services/sybilService';

export const SybilBalance = () => {
  const { data: balance, isLoading: isBalanceLoading } = useFetchBalance();

  return (
    <Typography.Title level={3}>
      Balance: {!balance || isBalanceLoading ? '...' : formatBalance(balance).toFixed(2)} USD
    </Typography.Title>
  );
};