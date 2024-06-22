import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SalesPieChart = ({ data, filterPeriod, colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'] }) => {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    // Filtrar los datos basados en el período seleccionado
    const now = new Date();
    const newData = data.filter(item => {
      const itemDate = new Date(item.date);
      switch (filterPeriod) {
        case 'day':
          return itemDate.toDateString() === now.toDateString();
        case 'month':
          return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
        case 'trimester':
          const currentQuarter = Math.floor((now.getMonth() + 3) / 3);
          const itemQuarter = Math.floor((itemDate.getMonth() + 3) / 3);
          return itemQuarter === currentQuarter && itemDate.getFullYear() === now.getFullYear();
        case 'semester':
          const currentSemester = now.getMonth() < 6 ? 1 : 2;
          const itemSemester = itemDate.getMonth() < 6 ? 1 : 2;
          return itemSemester === currentSemester && itemDate.getFullYear() === now.getFullYear();
        case 'year':
          return itemDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
    setFilteredData(newData);
  }, [data, filterPeriod]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const styles = {
    container: {
      width: '480px', // Ancho ajustado
      height: '350px', // Altura ajustada
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #ddd', // Borde leve al contenedor principal
      fontFamily: 'Arial, sans-serif',
      transition: 'transform 0.3s ease',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      position: 'relative',
      overflow: 'visible', // Permitir que las sombras se extiendan fuera del contenedor
    },
    chartShadow: {
      filter: 'drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2))', // Sombra al gráfico entero
    },
    tooltip: {
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#666', // Color gris para el texto del tooltip
    },
    legend: {
      fontSize: '14px',
      color: '#666', // Color gris para la leyenda
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      marginTop: '10px', // Margen superior para la leyenda
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
        <PieChart style={styles.chartShadow}>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={styles.tooltip} />
          <Legend
            wrapperStyle={styles.legend} // Margen superior para la leyenda
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            formatter={(value) => (
              <span
                title="Estas son las ventas de la tienda en el periodo seleccionado"
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

export default SalesPieChart;

