import { useEffect } from 'react';
import { Table } from 'antd';
import React from 'react';

import { WeatherBidsDocument, WeatherBidsQuery, execute } from '../../../../../.graphclient';

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
  const [data, setData] = React.useState<WeatherBidsQuery>()

  useEffect(() => {
    execute(WeatherBidsDocument, {}).then((result) => {
      console.log({ result });
      setData(result?.data);
    })
  }, []);

  return <Table columns={columns} dataSource={[]} pagination={false} showHeader={false} />;
};
