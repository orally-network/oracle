import { Table } from 'antd';
import React from 'react';

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
  return <Table columns={columns} dataSource={[]} pagination={false} showHeader={false} />;
};
