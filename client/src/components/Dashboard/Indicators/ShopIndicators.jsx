import React, { useEffect, useState } from 'react';
import FilterButtons from '../FilterButtons';
import './ShopIndicators.css';

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
      <h2 className="section-title">Shop Indicators</h2>
      <div className="indicators-grid mt-4">
        {indicators.map((indicator, index) => (
          <div key={index} className="indicator-card">
            <h3 className="indicator-title">Shop {indicator.shopId}</h3>
            <p className="indicator-text">Total Sales: {indicator.totalSales.toFixed(2)}</p>
            <p className="indicator-text">Total Quantity Sold: {indicator.totalQuantity}</p>
            <p className="indicator-text">Total Orders: {indicator.totalOrders}</p>
            <p className="indicator-text">Avg Sales per Order: {indicator.avgSalesPerOrder.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <FilterButtons filterOrders={filterOrders} showAllOrders={filterOrders.bind(null, 'Historical Data')} />
    </div>
  );
};

export default ShopIndicators;
