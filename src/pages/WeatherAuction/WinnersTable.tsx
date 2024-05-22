import { ExportOutlined } from '@ant-design/icons';
import IconLink from 'Components/IconLink';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { truncateAddressSymbolsNum } from 'Utils/addressUtils';
import { Card, Space, Table, Typography } from 'antd';
import { utils } from 'ethers';
import React from 'react';
import { useNavigate } from 'react-router-dom';
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

export const WinnersTable = ({
  pageSize = 100,
  day,
  title,
}: {
  pageSize?: number;
  day?: string;
  title?: string;
}) => {
  const { address } = useAccount();
  const { winners, isWinnersLoading, prediction } = useWeatherData();
  const navigate = useNavigate();

  return (
    <Card title={title || 'Previous Winners'} style={{ flex: 1 }}>
      <Table
        columns={columns}
        dataSource={day !== undefined ? winners.filter((winner) => winner.day === day) : winners}
        pagination={{ position: ['bottomRight'], defaultPageSize: pageSize }}
        loading={isWinnersLoading}
        rowKey="id"
        rowClassName={(record) => {
          return record.winner === address?.toLowerCase() ? 'highlight' : 'pointer';
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/weather-prediction/${prediction.name}/${record.day}`);
            },
          };
        }}
      />
    </Card>
  );
};
