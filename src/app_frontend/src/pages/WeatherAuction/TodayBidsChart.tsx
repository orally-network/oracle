import React from 'react';

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

export function renderChart(data: any) {
  return (
    <ResponsiveContainer width="100%" aspect={2} maxHeight={250}>
      <BarChart
        width={500}
        height={250}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="temperatureGuess" />
        <YAxis interval={1} domain={[0, 'dataMax+5']} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" stackId="a" fill="#1890FF" />
        <Bar dataKey="mine" stackId="a" fill="#fff" />
      </BarChart>
    </ResponsiveContainer>
  );
}
