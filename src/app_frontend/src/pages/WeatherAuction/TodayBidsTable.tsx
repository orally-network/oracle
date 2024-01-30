import { Card, Table } from 'antd';
import React from 'react';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { useAccount } from 'wagmi';
import { truncateAddressSymbolsNum } from 'Utils/addressUtils';

export const TodayBidsTable = () => {
  const { bids, isWinnersLoading } = useWeatherData();
  const { address } = useAccount();

  const columns = [
    {
      title: 'Address',
      dataIndex: 'bidder',
      key: 'bidder',
      render: (address: string) => truncateAddressSymbolsNum(address, 8),
    },
    {
      title: 'Mine',
      dataIndex: 'bidder',
      key: 'bidder',
      render: (val: string) => <strong>{val === address?.toLowerCase() ? 'Mine' : ''}</strong>,
    },
    {
      title: 'Tickets',
      dataIndex: 'ticketCount',
      key: 'ticketCount',
      render: (ticketCount: string) => <span>{`${ticketCount} ${ticketCount > 1 ? 'tickets' : 'ticket'}`}</span>,
    },
    {
      title: 'Temperature',
      dataIndex: 'temperatureGuess',
      key: 'temperatureGuess',
      render: (temp: string) => (
        <span>{temp.slice(0, temp.length - 1) + '.' + temp.slice(temp.length - 1)}℃</span>
      ),
    },
  ];

  return (
    <Card title="Today’s bids" style={{ flex: 1 }}>
      <Table
        columns={columns}
        dataSource={bids}
        pagination={false}
        showHeader={false}
        scroll={{ y: 260 }}
        loading={isWinnersLoading}
        rowKey="id"
        rowClassName={(record, index) => {
          return record.bidder === address?.toLowerCase() ? 'highlight' : '';
        }}
      />
    </Card>
  );
};
