import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const EarningsBarChart = ({ data }) => (
  <div className="bg-gray-800 shadow-lg rounded-lg p-8">
    <h2 className="text-2xl font-bold text-yellow-400 mb-6">Earnings by Item</h2>
    <div className="bg-gray-700 bg-opacity-20 p-6 rounded-lg backdrop-filter backdrop-blur-lg">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-current text-gray-500" />
          <XAxis type="number" className="text-gray-300" />
          <YAxis type="category" dataKey="name" className="text-gray-300" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'gray-200' }}
            itemStyle={{ color: 'black' }}
          />
          <Legend wrapperStyle={{ color: 'white' }} />
          <Bar dataKey="total" fill="#FFD700" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default EarningsBarChart;
