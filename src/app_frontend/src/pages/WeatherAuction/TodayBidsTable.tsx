import { Card, Table } from 'antd';
import React, { useState } from 'react';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { useAccount } from 'wagmi';
import { truncateAddressSymbolsNum } from 'Utils/addressUtils';
import { TableOutlined, BarChartOutlined } from '@ant-design/icons';
import { renderChart } from './TodayBidsChart';

export const TodayBidsTable = () => {
  const { bids, isWinnersLoading } = useWeatherData();
  const { address } = useAccount();

  const [isTableView, setIsTableView] = useState(true);

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
      render: (ticketCount: string) => (
        <span>{`${ticketCount} ${+ticketCount > 1 ? 'tickets' : 'ticket'}`}</span>
      ),
    },
    {
      title: 'Temperature',
      dataIndex: 'temperatureGuess',
      key: 'temperatureGuess',
      render: (temp: string) => <span>{+temp / 10}℃</span>,
    },
  ];

  const cardView = () =>
    isTableView ? (
      <TableOutlined
        style={{
          fontSize: '20px',
          color: '#1890ff',
        }}
      />
    ) : (
      <BarChartOutlined
        style={{
          fontSize: '20px',
          color: '#1890ff',
        }}
      />
    );

  const chartData = bids.reduce((acc, record) => {
    const index = acc.findIndex((item: any) => item.temperatureGuess === record.temperatureGuess);
    if (index !== -1) {
      acc[index].count++;
      acc[index].mine = acc[index].mine || record.bidder === address ? acc[index].mine++ : 0;
    } else {
      acc.push({
        temperatureGuess: record.temperatureGuess / 10,
        count: 1,
        mine: record.bidder === address ? acc[index].mine++ : 0,
      });
    }
    return acc;
  }, []);

  return (
    <Card
      title="Today’s bids"
      style={{ flex: 1 }}
      extra={<div onClick={() => setIsTableView(!isTableView)}>{cardView()}</div>}
    >
      {isTableView ? (
        <Table
          columns={columns}
          dataSource={bids}
          pagination={false}
          showHeader={false}
          scroll={{ y: 240 }}
          loading={isWinnersLoading}
          rowKey="id"
          rowClassName={(record, index) => {
            return record.bidder === address?.toLowerCase() ? 'highlight' : '';
          }}
        />
      ) : (
        renderChart(chartData)
      )}
    </Card>
  );
};
