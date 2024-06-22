import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SalesScatterChart = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const styles = {
    container: {
      
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #ddd',
      fontFamily: 'Arial, sans-serif',
      transition: 'transform 0.3s ease',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      position: 'relative',
      overflow: 'visible',
    },
    chartShadow: {
      filter: 'drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))',
    },
    xAxis: {
      fontSize: '14px',
      fontWeight: 'bold',
      fill: '#666',
    },
    yAxis: {
      fontSize: '14px',
      fontWeight: 'bold',
      fill: '#666',
    },
    tooltip: {
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#666',
    },
    legend: {
      fontSize: '14px',
      color: '#666',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      marginTop: '10px',
    },
    legendHover: {
      transform: 'scale(1.1)',
    },
  };

  return (
    <div
      style={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ResponsiveContainer>
        <ScatterChart
          margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
          style={styles.chartShadow}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="price" name="Price" tick={{ fill: '#666', fontWeight: 'bold' }} />
          <YAxis dataKey="quantity" name="Quantity" tick={{ fill: '#666', fontWeight: 'bold' }} />
          <Tooltip contentStyle={styles.tooltip} />
          <Legend
            wrapperStyle={styles.legend}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            formatter={(value) => (
              <span
                title="Esta es la relación entre precio y cantidad vendida en el periodo seleccionado"
                style={isHovered ? { ...styles.legend, ...styles.legendHover } : styles.legend}
              >
                {value}
              </span>
            )}
          />
          <Scatter name="Sales" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesScatterChart;
