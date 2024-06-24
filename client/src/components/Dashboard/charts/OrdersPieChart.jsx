import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#FFD700', '#A9A9A9', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const OrdersPieChart = ({ data }) => {
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
    ordersCount: item.ordersCount,
  }));

  return (
    <div
      style={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ResponsiveContainer>
        <PieChart style={styles.chartShadow}>
          <Pie
            data={processedData}
            dataKey="ordersCount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={styles.tooltip} />
          <Legend
            wrapperStyle={styles.legend}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            formatter={(value) => (
              <span
                title="Esta es la cantidad de órdenes que recibió la tienda en el periodo seleccionado"
                style={isHovered ? { ...styles.legend, ...styles.legendHover } : styles.legend}
              >
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersPieChart;
