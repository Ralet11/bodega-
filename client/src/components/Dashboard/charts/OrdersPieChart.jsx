import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#FFD700', '#A9A9A9', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const OrdersPieChart = ({ data }) => (
  <div style={{ width: '100%', height: 200 }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          dataKey="ordersCount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'gray-200' }}
          itemStyle={{ color: 'black' }}
        />
        <Legend wrapperStyle={{ color: 'white' }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default OrdersPieChart;
