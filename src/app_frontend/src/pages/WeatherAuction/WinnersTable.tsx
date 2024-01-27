import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { truncateAddressSymbolsNum } from 'Utils/addressUtils';
import { Card, Table } from 'antd';
import React from 'react';

const columns = [
  {
    title: 'Address',
    dataIndex: 'id',
    key: 'winner',
    render: (address: string) => truncateAddressSymbolsNum(address, 8),
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Prize',
    dataIndex: 'prize',
    key: 'prize',
  },
  {
    title: 'Temperature',
    dataIndex: 'temperature',
    key: 'temperatureGuess',
    render: (temp: string) => (
      <span>{temp.slice(0, temp.length - 1) + '.' + temp.slice(temp.length - 1)}℃</span>
    ),
  },
];

export const WinnersTable = () => {
  const { winners, isWinnersLoading } = useWeatherData();

  return (
    <Card title="Previous Winners">
      <Table
        columns={columns}
        dataSource={winners}
        pagination={{ position: ['bottomRight'], defaultPageSize: 2 }}
        loading={isWinnersLoading}
        rowKey="id"
      />
    </Card>
  );
};
