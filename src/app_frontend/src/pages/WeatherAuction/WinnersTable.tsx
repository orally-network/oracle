import { ExportOutlined } from '@ant-design/icons';
import IconLink from 'Components/IconLink';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { truncateAddressSymbolsNum } from 'Utils/addressUtils';
import { Card, Space, Table, Typography } from 'antd';
import { utils } from 'ethers';
import React from 'react';
import { useAccount } from 'wagmi';

const columns = [
  {
    title: 'Address',
    dataIndex: 'winner',
    key: 'winner',
    render: (address: string, winner: any) => (
      <Space size="small">
        <Typography.Text copyable={{ text: address }}>
          {truncateAddressSymbolsNum(address, 8)}
        </Typography.Text>
        <IconLink
          link={`https://arbiscan.io/tx/${winner.transactionHash}#eventlog`}
          IconComponent={ExportOutlined}
        />
      </Space>
    ),
  },
  {
    title: 'Day',
    dataIndex: 'day',
    key: 'day',
  },
  {
    title: 'Prize',
    dataIndex: 'winnerPrizeLabel',
    key: 'winnerPrizeLabel',
    render: (prizeLabel: string, winner: any) => (
      <span>{prizeLabel ?? Number(utils.formatEther(winner.winnerPrize)).toFixed(4)}</span>
    ),
  },
  {
    title: 'Temperature',
    dataIndex: 'temperature',
    key: 'temperatureGuess',
    render: (temp: string) => <span>{+temp / 10}℃</span>,
  },
];

export const WinnersTable = () => {
  const { address } = useAccount();
  const { winners, isWinnersLoading } = useWeatherData();

  return (
    <Card title="Previous Winners">
      <Table
        columns={columns}
        dataSource={winners}
        pagination={{ position: ['bottomRight'], defaultPageSize: 100 }}
        loading={isWinnersLoading}
        rowKey="id"
        rowClassName={(record, index) => {
          return record.winner === address?.toLowerCase() ? 'highlight' : '';
        }}
      />
    </Card>
  );
};
