import { Typography } from 'antd';
import { useGlobalState } from 'Providers/GlobalState';
import { useEffect } from 'react';
import { formatBalance } from 'Utils/balance';
import { useSybilBalanceStore, fetchBalance } from 'Stores/useSybilBalanceStore';

export const SybilBalance = () => {
  const { addressData } = useGlobalState();

  const balance = useSybilBalanceStore((state) => state.balance);
  const isBalanceLoading = useSybilBalanceStore((state) => state.isBalanceLoading);

  useEffect(() => {
    if (addressData?.address) {
      fetchBalance(addressData.address);
    }
  }, [addressData?.address]);

  return (
    <Typography.Title level={3}>
      Balance: {isBalanceLoading ? '...' : formatBalance(balance).toFixed(2)} USD
    </Typography.Title>
  );
};