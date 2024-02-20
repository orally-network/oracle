import React from 'react';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartItem } from './TodayBidsTable';

export function renderChart(data: any, isMobile: boolean) {
  const maxOthers = Math.max(...data.map((obj: ChartItem) => obj.others));

  const tickArray = Array.from({ length: maxOthers + 2 }, (_, i) => i);

  return (
    <ResponsiveContainer
      width="100%"
      height={isMobile ? 350 : 250}
      maxHeight={isMobile ? 350 : 250}
    >
      <BarChart
        width={500}
        height={isMobile ? 350 : 250}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="temperatureGuess" />
        <YAxis interval={0} domain={[0, 'dataMax+1']} ticks={tickArray} />
        <Tooltip cursor={{ fill: 'transparent' }} />
        <Legend />
        <Bar dataKey="others" stackId="a" fill="#1890FF" />
        <Bar dataKey="mine" stackId="a" fill="#2F21FF" />
      </BarChart>
    </ResponsiveContainer>
  );
}
