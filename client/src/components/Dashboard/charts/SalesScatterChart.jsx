import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
  } from 'recharts';
  
  const SalesScatterChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis dataKey="price" name="Price" />
        <YAxis dataKey="quantity" name="Quantity" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Sales" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
  
  export default SalesScatterChart;
  