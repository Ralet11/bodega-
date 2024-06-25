import React, { useEffect, useState } from 'react';

const ProductIndicators = ({ ordersData, selectedProduct }) => {
  const [indicators, setIndicators] = useState({
    totalSales: 0,
    totalQuantity: 0,
    totalOrders: 0,
    avgSalesPerOrder: 0,
  });

  useEffect(() => {
    if (selectedProduct && ordersData) {
      let totalSales = 0;
      let totalQuantity = 0;
      let totalOrders = 0;

      Object.keys(ordersData).forEach(shopId => {
        const filteredOrders = ordersData[shopId].orders.filter(order => 
          order.order_details.some(item => item.id === selectedProduct)
        );

        filteredOrders.forEach(order => {
          totalOrders += 1;
          order.order_details.forEach(item => {
            if (item.id === selectedProduct) {
              totalSales += parseFloat(item.price.replace(/[^0-9.-]+/g, "")) * item.quantity;
              totalQuantity += item.quantity;
            }
          });
        });
      });

      const avgSalesPerOrder = totalOrders ? (totalSales / totalOrders) : 0;

      setIndicators({
        totalSales,
        totalQuantity,
        totalOrders,
        avgSalesPerOrder,
      });
    }
  }, [selectedProduct, ordersData]);

  if (!selectedProduct) {
    return <div className="text-center text-xl font-bold mt-4">Please select a product to see the indicators.</div>;
  }

  return (
    <div className="product-indicators mt-4">
      <h2 className="text-2xl font-bold mb-4">Product Indicators</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Sales</h3>
          <p className="text-xl">{indicators.totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Quantity Sold</h3>
          <p className="text-xl">{indicators.totalQuantity}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-xl">{indicators.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Avg Sales per Order</h3>
          <p className="text-xl">{indicators.avgSalesPerOrder.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductIndicators;
