import React, { useEffect, useState } from 'react';
import { ChartBarIcon, ShoppingBagIcon, ShoppingCartIcon, CurrencyDollarIcon, PencilIcon } from '@heroicons/react/24/outline';
import FilterButtons from '../FilterButtons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ShopIndicators = ({ ordersData, filterPeriod, filterOrders, shops }) => {
  const [indicators, setIndicators] = useState([]);
  const activeShop = useSelector((state) => state.activeShop);
  const navigate = useNavigate();

  const getCurrentDay = () => {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[new Date().getDay()];
  };

  const isShopOpen = (shop) => {
    const currentDay = getCurrentDay();
    const currentTime = new Date().toTimeString().split(' ')[0]; // Hora actual en formato HH:mm:ss
    const openHours = shop.openingHours.find(hour => hour.day === currentDay);

    if (openHours) {
      return currentTime >= openHours.open_hour && currentTime <= openHours.close_hour;
    }
    return false;
  };

  const handleEditClick = (shopId) => {
    navigate(`/settings`);
  };

  useEffect(() => {
    const calculateIndicators = (data) => {
      return Object.keys(data).map(shopId => {
        const shopData = data[shopId];
        const shopInfo = shops.find(shop => shop.id === parseInt(shopId)); // Encuentra el nombre del shop basado en shopId
        const totalSales = shopData.orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
        const totalQuantity = shopData.orders.reduce((sum, order) => {
          return sum + order.order_details.reduce((qSum, item) => qSum + item.quantity, 0);
        }, 0);
        const totalOrders = shopData.orders.length;
        const avgSalesPerOrder = totalOrders ? (totalSales / totalOrders) : 0;

        return {
          shopId,
          shopName: shopInfo ? shopInfo.name : 'Unknown Shop',
          totalSales,
          totalQuantity,
          totalOrders,
          avgSalesPerOrder,
          isOpen: shopInfo ? isShopOpen(shopInfo) : false // Determina si la tienda está abierta
        };
      });
    };

    if (ordersData) {
      const newIndicators = calculateIndicators(ordersData);
      setIndicators(newIndicators);
    }
  }, [ordersData, filterPeriod, shops]);

  if (indicators.length === 0) {
    return <div className="text-center text-xl font-bold mt-4">No data available for shops.</div>;
  }

  return (
    <div className="shop-indicators mt-4">
      <h2 className="text-2xl font-bold mb-4">Shop Indicators</h2>
      <FilterButtons filterOrders={filterOrders} showAllOrders={filterOrders.bind(null, 'Historical Data')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {indicators.map((indicator, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 ${
              indicator.shopId == activeShop ? 'bg-yellow-100' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <ShoppingBagIcon className="h-8 w-8 text-blue-500" />
                <h3 className="text-md font-semibold text-gray-800 ml-3">{indicator.shopName}</h3>
                <span className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold ${
                  indicator.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {indicator.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              {indicator.shopId == activeShop && (
                <button
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  onClick={() => handleEditClick(indicator.shopId)}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="flex items-center mb-1">
              <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
              <p className="text-md text-gray-700 ml-2">Total Sales: ${indicator.totalSales.toFixed(2)}</p>
            </div>
            <div className="flex items-center mb-1">
              <ShoppingCartIcon className="h-5 w-5 text-yellow-500" />
              <p className="text-md text-gray-700 ml-2">Total Quantity Sold: {indicator.totalQuantity}</p>
            </div>
            <div className="flex items-center mb-1">
              <ChartBarIcon className="h-5 w-5 text-red-500" />
              <p className="text-md text-gray-700 ml-2">Total Orders: {indicator.totalOrders}</p>
            </div>
            <div className="flex items-center">
              <ChartBarIcon className="h-5 w-5 text-purple-500" />
              <p className="text-md text-gray-700 ml-2">Avg Sales per Order: ${indicator.avgSalesPerOrder.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopIndicators;
