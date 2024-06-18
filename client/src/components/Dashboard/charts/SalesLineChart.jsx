import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../utils';
import { formatQuantity } from '../utils';

const SalesLineChart = ({ data, totalSalesAmount, totalSalesQuantity }) => (
  <div className="bg-gray-800 shadow-lg rounded-lg p-8">
    <h2 className="text-2xl font-bold text-yellow-400 mb-6">Sales Trend (Total Sales: {formatCurrency(totalSalesAmount)}, Total Quantity: {formatQuantity(totalSalesQuantity)})</h2>
    <div className="bg-gray-700 bg-opacity-20 p-6 rounded-lg backdrop-filter backdrop-blur-lg">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-current text-gray-500" />
          <XAxis dataKey="date" className="text-gray-300" />
          <YAxis className="text-gray-300" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'gray-200' }}
            itemStyle={{ color: 'black' }}
          />
          <Line type="monotone" dataKey="sales" stroke="#FFD700" strokeWidth={3} />
          <Line type="monotone" dataKey="quantity" stroke="#A9A9A9" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default SalesLineChart;
