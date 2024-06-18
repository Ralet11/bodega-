import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const SalesScatterChart = ({ data }) => (
  <div className="bg-gray-800 shadow-lg rounded-lg p-8">
    <h2 className="text-2xl font-bold text-yellow-400 mb-6">Sales Scatter Chart</h2>
    <div className="bg-gray-700 bg-opacity-20 p-6 rounded-lg backdrop-filter backdrop-blur-lg">
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" className="stroke-current text-gray-500" />
          <XAxis dataKey="price" name="Price" className="text-gray-300" />
          <YAxis dataKey="quantity" name="Quantity" className="text-gray-300" />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'gray-200' }}
            itemStyle={{ color: 'black' }}
          />
          <Scatter name="Sales" data={data} fill="#FFD700" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default SalesScatterChart;
