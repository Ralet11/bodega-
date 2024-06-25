import React, { useEffect, useState } from 'react';
import FilterButtons from '../FilterButtons';

const ShopIndicators = ({ ordersData, filterPeriod, filterOrders }) => {
  const [indicators, setIndicators] = useState([]);

  useEffect(() => {
    const calculateIndicators = (data) => {
      return Object.keys(data).map(shopId => {
        const shopData = data[shopId];
        const totalSales = shopData.orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
        const totalQuantity = shopData.orders.reduce((sum, order) => {
          return sum + order.order_details.reduce((qSum, item) => qSum + item.quantity, 0);
        }, 0);
        const totalOrders = shopData.orders.length;
        const avgSalesPerOrder = totalOrders ? (totalSales / totalOrders) : 0;

        return {
          shopId,
          totalSales,
          totalQuantity,
          totalOrders,
          avgSalesPerOrder,
        };
      });
    };

    if (ordersData) {
      const newIndicators = calculateIndicators(ordersData);
      setIndicators(newIndicators);
    }
  }, [ordersData, filterPeriod]);

  if (indicators.length === 0) {
    return <div className="text-center text-xl font-bold mt-4">No data available for shops.</div>;
  }

  return (
    <div className="shop-indicators mt-4">
      <h2 className="text-2xl font-bold mb-4">Shop Indicators</h2>
      <FilterButtons filterOrders={filterOrders} showAllOrders={filterOrders.bind(null, 'Historical Data')} />
      <div className="grid grid-cols-2 gap-4 mt-4">
        {indicators.map((indicator, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Shop {indicator.shopId}</h3>
            <p className="text-xl">Total Sales: {indicator.totalSales.toFixed(2)}</p>
            <p className="text-xl">Total Quantity Sold: {indicator.totalQuantity}</p>
            <p className="text-xl">Total Orders: {indicator.totalOrders}</p>
            <p className="text-xl">Avg Sales per Order: {indicator.avgSalesPerOrder.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopIndicators;
