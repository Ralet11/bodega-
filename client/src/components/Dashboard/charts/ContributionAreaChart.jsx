import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ContributionAreaChart = ({ data }) => {
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
    xAxis: {
      fontSize: '14px',
      fontWeight: 'bold',
      fill: '#666', // Color gris para las etiquetas del eje X
    },
    yAxis: {
      fontSize: '14px',
      fontWeight: 'bold',
      fill: '#666', // Color gris para las etiquetas del eje Y
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
      bottom: '0px'
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
        <AreaChart
          data={data}
          margin={{ top: 40, right: 30, left: 20, bottom: 20 }} // Aumentar el margen superior del gráfico
          style={styles.chartShadow}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" tick={{ fill: '#666', fontWeight: 'bold', dy: 10 }} /> {/* Ajustar la posición vertical de las etiquetas del eje X */}
          <YAxis tick={{ fill: '#666', fontWeight: 'bold' }} />
          <Tooltip contentStyle={styles.tooltip} />
          <Legend
            wrapperStyle={styles.legend} // Margen superior para la leyenda
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            formatter={(value) => (
              <span
                title="Esta es la contribución de la tienda en el periodo seleccionado"
                style={isHovered ? { ...styles.legend, ...styles.legendHover } : styles.legend}
              >
                {value}
              </span>
            )}
          />
          <Area type="monotone" dataKey="contribution" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContributionAreaChart;
