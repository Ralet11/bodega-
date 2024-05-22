import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Dot
} from 'recharts';

const SalesAndCategoriesChart = () => {
  const data = [
    { name: 'Jan', thisQuarter: 10, lastQuarter: 6 },
    { name: 'Feb', thisQuarter: 15, lastQuarter: 10 },
    { name: 'Mar', thisQuarter: 8, lastQuarter: 12 },
    { name: 'Apr', thisQuarter: 10, lastQuarter: 11 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="thisQuarter" name="This Quarter" stroke="#8884d8" fill="#8884d8" dot={<Dot r={6} strokeWidth={2} />} />
        <Area type="monotone" dataKey="lastQuarter" name="Last Quarter" stroke="#82ca9d" fill="#82ca9d" dot={<Dot r={6} strokeWidth={2} />} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesAndCategoriesChart;