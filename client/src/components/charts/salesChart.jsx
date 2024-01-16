import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SalesCard = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const data = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
      datasets: [
        {
          label: 'Ventas',
          data: [1000, 1500, 1200, 2000, 1800],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const chartConfig = {
      type: 'bar',
      data: data,
      options: {
        responsive: true, // Permite que el gráfico se ajuste al tamaño del contenedor
        maintainAspectRatio: false, // Permite ajustar el tamaño del gráfico al contenedor
      },
    };

    const myChart = new Chart(chartRef.current, chartConfig);

    return () => {
      myChart.destroy();
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 hover:shadow-xl transition duration-300 w-[400px] salesCard">
      <h2 className="text-sm font-semibold mb-1">Ventas Mensuales</h2>
      <div className="flex-1">
        <canvas ref={chartRef} style={{ maxWidth: '100%' }} />
      </div>
      <p className="text-gray-500 mt-2">Total de ventas este mes: $10,000</p>
    </div>
  );
};

export default SalesCard;