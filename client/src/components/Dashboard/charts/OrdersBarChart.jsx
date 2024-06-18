import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const OrdersBarChart = ({ data }) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Orders by Shop</h2>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" />
        <Tooltip />
        <Legend />
        <Bar dataKey="ordersCount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default OrdersBarChart;
