import React, { useState, useEffect } from 'react';
import OrdersBarChart from '../charts/OrdersBarChart';
import ContributionAreaChart from '../charts/ContributionAreaChart';
import SalesPieChart from '../charts/SalesPieChart';
import FilterButtons from '../FilterButtons';

const HistoricalDataSection = ({ ordersData }) => {
  const [filteredOrdersData, setFilteredOrdersData] = useState(ordersData);
  const [filterPeriod, setFilterPeriod] = useState('Historical Data');

  const filterOrders = (period) => {
    setFilterPeriod(period);

    const now = new Date();
    const newFilteredData = {};

    Object.keys(ordersData).forEach(shopId => {
      const filteredOrders = ordersData[shopId].orders.filter(order => {
        const orderDate = new Date(order.date_time);
        switch (period) {
          case 'day':
            return orderDate.toDateString() === now.toDateString();
          case 'month':
            return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
          case 'trimester':
            const currentQuarter = Math.floor((now.getMonth() + 3) / 3);
            const orderQuarter = Math.floor((orderDate.getMonth() + 3) / 3);
            return orderQuarter === currentQuarter && orderDate.getFullYear() === now.getFullYear();
          case 'semester':
            const currentSemester = now.getMonth() < 6 ? 1 : 2;
            const orderSemester = orderDate.getMonth() < 6 ? 1 : 2;
            return orderSemester === currentSemester && orderDate.getFullYear() === now.getFullYear();
          case 'year':
            return orderDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });

      const sales = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
      const quantity = filteredOrders.reduce((sum, order) => {
        return sum + order.order_details.reduce((qSum, item) => qSum + item.quantity, 0);
      }, 0);
      const ordersCount = filteredOrders.length;

      newFilteredData[shopId] = { sales, quantity, ordersCount, orders: filteredOrders };
    });

    setFilteredOrdersData(newFilteredData);
  };

  const showAllOrders = () => {
    setFilterPeriod('Historical Data');
    setFilteredOrdersData(ordersData);
  };

  useEffect(() => {
    setFilteredOrdersData(ordersData);
  }, [ordersData]);

  const totalSales = Object.values(filteredOrdersData).reduce((sum, shop) => sum + shop.sales, 0);
  const ordersListData = Object.keys(filteredOrdersData).map(shopId => ({
    name: `Shop ${shopId}`,
    ordersCount: filteredOrdersData[shopId].ordersCount || 0
  }));

  const contributionData = Object.keys(filteredOrdersData).map(shopId => ({
    name: `Shop ${shopId}`,
    contribution: (filteredOrdersData[shopId].sales / totalSales) * 100 || 0
  }));

  const pieChartData = Object.keys(filteredOrdersData).map(shopId => ({
    name: `Shop ${shopId}`,
    value: filteredOrdersData[shopId].sales || 0
  }));

  return (
    <div className="historical-data-section">
      <h2 className="text-2xl font-bold mb-4">Historical Data</h2>
      <div className="mt-4 flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 lg:w-1/3 px-2">
          <OrdersBarChart data={Array.isArray(ordersListData) ? ordersListData : []} />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 px-2">
          <ContributionAreaChart data={Array.isArray(contributionData) ? contributionData : []} />
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 px-2">
          <SalesPieChart data={Array.isArray(pieChartData) ? pieChartData : []} />
        </div>
      </div>
      <FilterButtons filterOrders={filterOrders} showAllOrders={showAllOrders} />
    </div>
  );
};

export default HistoricalDataSection;
