import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const QuantityAreaChart = ({ data }) => (
  <div className="bg-gray-800 shadow-lg rounded-lg p-8">
    <h2 className="text-2xl font-bold text-yellow-400 mb-6">Total Quantity by Item</h2>
    <div className="bg-gray-700 bg-opacity-20 p-6 rounded-lg backdrop-filter backdrop-blur-lg">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-current text-gray-500" />
          <XAxis dataKey="name" className="text-gray-300" />
          <YAxis className="text-gray-300" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'gray-200' }}
            itemStyle={{ color: 'black' }}
          />
          <Legend wrapperStyle={{ color: 'white' }} />
          <Area type="monotone" dataKey="quantity" stroke="#FFD700" fill="#FFD700" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default QuantityAreaChart;
