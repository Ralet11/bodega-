import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SalesAndComparisonChart = () => {
  const data = [
    { name: 'January', 'Current Sales': 12000, 'Last Year Sales': 10000 },
    { name: 'February', 'Current Sales': 14500, 'Last Year Sales': 13000 },
    { name: 'March', 'Current Sales': 13200, 'Last Year Sales': 11000 },
    { name: 'April', 'Current Sales': 15500, 'Last Year Sales': 12000 },
];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='Current Sales' fill="rgba(112, 161, 255, 0.6)" stroke="#70a1ff" strokeWidth={2} /> {/* Cambia el cuarto valor para ajustar la opacidad */}
        <Bar dataKey='Last Year Sales' fill="rgba(0, 216, 216, 0.6)" stroke="#00d8d8" strokeWidth={2} /> {/* Cambia el cuarto valor para ajustar la opacidad */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesAndComparisonChart;
