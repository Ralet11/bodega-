import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Componente personalizado para las barras con sombra y ajuste en la posición y
const CustomBar = (props) => {
  const { x, y, width, height, fill } = props;
  return (
    <g>
      <rect
        x={x}
        y={y - 4} // Levanta la barra 4px para agregar un espacio en la parte inferior
        width={width}
        height={height}
        fill={fill}
        radius="10 10 0 0" // Esquinas redondeadas en la parte superior
        style={{
          filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))', // Sombra
        }}
      />
    </g>
  );
};

const OrdersBarChart = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const styles = {
    container: {
      width: '100%',
      height: 350, // Aumenta la altura para acomodar el margen superior
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
      bottom: '0px',
      right: '0px'
      
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
        <BarChart
          data={data}
          margin={{ top: 40, right: 30, left: 20, bottom: 20 }} // Aumentar el margen superior del gráfico
          barCategoryGap="10%"
          style={styles.chartShadow}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" tick={{ fill: '#666', fontWeight: 'bold', dy: 10 }} /> {/* Ajustar la posición vertical de las etiquetas del eje X */}
          <YAxis tick={{ fill: '#666', fontWeight: 'bold' }} />
          <Tooltip contentStyle={styles.tooltip} />
          <Legend
            wrapperStyle={{ ...styles.legend}} // Aumentar el margen superior de la leyenda
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            payload={[
              {
                value: 'Orders',
                type: 'square',
                id: 'ID01',
                color: '#ffc658',
              },
            ]}
            
            formatter={(value) => (
              <span
                title="Esta es la cantidad de órdenes que recibió la tienda en el periodo seleccionado"
                style={isHovered ? { ...styles.legend, ...styles.legendHover } : styles.legend}
              >
                {value}
              </span>
            )}
          />
          <Bar
            dataKey="ordersCount"
            fill="#ffc658"
            barSize={30}
            shape={<CustomBar />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersBarChart;
