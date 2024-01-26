import { Table } from 'antd';
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_BIDS } from './queries/auction';

const columns = [
  {
    title: 'Address',
    dataIndex: 'id',
    key: 'id',
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
    key: 'temp',
  },
];

export const TodayBidsTable = () => {
  const { loading, error, data } = useQuery(GET_BIDS);

  console.log(error);

  return <Table columns={columns} dataSource={[]} pagination={false} showHeader={false} />;
};
