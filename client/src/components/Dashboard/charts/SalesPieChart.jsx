import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#FFD700', '#A9A9A9', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const SalesPieChart = ({ data }) => (
  <div className="bg-gray-800 shadow-lg rounded-lg p-8">
    <h2 className="text-2xl font-bold text-yellow-400 mb-6">Sales by Shop</h2>
    <div className="bg-gray-700 bg-opacity-20 p-6 rounded-lg backdrop-filter backdrop-blur-lg">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
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
  </div>
);

export default SalesPieChart;
