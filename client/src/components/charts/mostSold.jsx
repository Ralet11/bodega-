import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MostSelledItemsChart = () => {
  const data = [
    { name: 'Item 1', 'sold this month': 20 },
    { name: 'Item 2', 'sold this month': 15 },
    { name: 'Item 3', 'sold this month': 10 },
    // Add more items here if needed
  ];

  const sortedData = data.sort((a, b) => b['sold this month'] - a['sold this month']);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        layout="vertical"
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="sold this month"
          fill="#0072B2"
          barSize={20}
          barCategoryGap={0}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MostSelledItemsChart;