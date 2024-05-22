import { Card, Empty, Flex, Table, Typography } from 'antd';
import React, { useState } from 'react';
import { useWeatherData } from 'Providers/WeatherAuctionData/useWeatherData';
import { useAccount } from 'wagmi';
import { truncateAddressSymbolsNum } from 'Utils/addressUtils';
import { TableOutlined, BarChartOutlined } from '@ant-design/icons';
import { renderChart } from './TodayBidsChart';
import Loader from 'Components/Loader';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';

export interface ChartItem {
  temperatureGuess: number;
  others: number;
  mine: number;
}

export const TodayBidsTable = ({
  isTable = false,
  title,
}: {
  isTable?: boolean;
  title?: string;
}) => {
  const { bids, isWinnersLoading } = useWeatherData();
  const { address } = useAccount();

  const [isTableView, setIsTableView] = useState(isTable);

  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;

  const columns = [
    {
      title: 'Address',
      dataIndex: 'bidder',
      key: 'bidder',
      render: (address: string) => (
        <Typography.Text copyable={{ text: address }} style={{ minWidth: 150, display: 'block' }}>
          {truncateAddressSymbolsNum(address, 8)}
        </Typography.Text>
      ),
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
      <BarChartOutlined
        style={{
          fontSize: '20px',
          color: '#1890ff',
          cursor: 'pointer',
        }}
      />
    ) : (
      <TableOutlined
        style={{
          fontSize: '20px',
          color: '#1890ff',
          cursor: 'pointer',
        }}
      />
    );

  const chartData = bids.reduce<ChartItem[]>((acc, record) => {
    const index = acc.findIndex(
      (item: ChartItem) => Number(item.temperatureGuess) === Number(record.temperatureGuess) / 10
    );

    if (index !== -1) {
      acc[index].others += Number(record.ticketCount);

      if (record.bidder === address?.toLowerCase()) {
        acc[index].mine += Number(record.ticketCount);
        acc[index].others -= Number(record.ticketCount);
      }
    } else {
      const mine = record.bidder === address?.toLowerCase() ? 1 : 0;

      acc.push({
        temperatureGuess: Number(record.temperatureGuess) / 10,
        others: mine ? 0 : Number(record.ticketCount),
        mine: mine ? Number(record.ticketCount) : 0,
      });
    }
    return acc;
  }, []);

  return (
    <Card
      title={title || 'Today’s bids'}
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
      ) : isWinnersLoading ? (
        <Flex justify="center" align="center" style={{ minHeight: 170 }}>
          <Loader />
        </Flex>
      ) : chartData.length === 0 ? (
        <Flex justify="center" align="center">
          <Empty />
        </Flex>
      ) : (
        renderChart(
          chartData.sort((a: any, b: any) => a.temperatureGuess - b.temperatureGuess),
          isMobile
        )
      )}
    </Card>
  );
};
