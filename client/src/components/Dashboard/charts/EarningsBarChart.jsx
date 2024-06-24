import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const EarningsBarChart = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const styles = {
    container: {
      width: '480px',
      height: '350px',
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

  const processedData = data.map(item => ({
    name: item.name,
    total: item.total,
  }));

  return (
    <div
      style={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ResponsiveContainer>
        <BarChart
          data={processedData}
          margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
          barCategoryGap="10%"
          style={styles.chartShadow}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" tick={{ fill: '#666', fontWeight: 'bold', dy: 10 }} />
          <YAxis tick={{ fill: '#666', fontWeight: 'bold' }} />
          <Tooltip contentStyle={styles.tooltip} />
          <Legend
            wrapperStyle={styles.legend}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            formatter={(value) => (
              <span
                title="Estas son las ganancias totales de la tienda en el periodo seleccionado"
                style={isHovered ? { ...styles.legend, ...styles.legendHover } : styles.legend}
              >
                {value}
              </span>
            )}
          />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsBarChart;
