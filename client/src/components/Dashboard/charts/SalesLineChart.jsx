import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../utils';
import { formatQuantity } from '../utils';



const SalesLineChart = ({ data, totalSalesAmount }) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Sales Trend (Total Sales: {formatCurrency(totalSalesAmount)})</h2>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value, name, props) => {
          if (name === 'sales') {
            return [formatCurrency(value), 'Sales'];
          } else if (name === 'quantity') {
            return [formatQuantity(value), 'Quantity'];
          }
          return [value, name];
        }} />
        <Line type="monotone" dataKey="sales" stroke="#8884d8" />
        <Line type="monotone" dataKey="quantity" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default SalesLineChart;
