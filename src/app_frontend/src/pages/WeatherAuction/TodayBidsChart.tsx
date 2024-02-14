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
        <XAxis dataKey="temperatureGuess" />
        <YAxis interval={1} domain={[0, 'dataMax+1']} />
        <Tooltip />
        <Legend />
        <Bar dataKey="others" stackId="a" fill="#1890FF" />
        <Bar dataKey="mine" stackId="a" fill="#2F21FF" />
      </BarChart>
    </ResponsiveContainer>
  );
}
