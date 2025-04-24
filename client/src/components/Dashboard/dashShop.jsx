// ShopsComponent.js

import React, { useState, useEffect } from 'react';
import ShopIndicators from './Indicators/ShopIndicators';
import { useSelector } from 'react-redux';

const ShopsComponent = ({ shops, ordersData }) => {
  const activeShop = useSelector((state) => state.activeShop);
  const [selectedShop, setSelectedShop] = useState(null);
  const [initialOrdersData, setInitialOrdersData] = useState({});
  const [filteredOrdersData, setFilteredOrdersData] = useState({});
  const [filterPeriod, setFilterPeriod] = useState('Historical Data');
  const [filteredItemTotals, setFilteredItemTotals] = useState({});

  useEffect(() => {
    if (activeShop) {
      setSelectedShop(activeShop);
    }
  }, [activeShop]);

  useEffect(() => {
    const ordersDataWithShopNames = {};
    Object.keys(ordersData).forEach((shopId) => {
      const shopName = shops.find((shop) => shop.id === parseInt(shopId))?.name || 'Unknown Shop';
      const ordersWithShopName = ordersData[shopId].orders.map((order) => ({
        ...order,
        shopName,
      }));
      ordersDataWithShopNames[shopId] = {
        ...ordersData[shopId],
        orders: ordersWithShopName,
        shopName,
      };
    });
    setInitialOrdersData(ordersDataWithShopNames);
    setFilteredOrdersData(ordersDataWithShopNames);
  }, [ordersData, shops]);

  const filterOrders = (period) => {
    setFilterPeriod(period);
    const now = new Date();
    const newFilteredData = {};

    Object.keys(initialOrdersData).forEach((shopId) => {
      const filteredOrders = initialOrdersData[shopId].orders.filter((order) => {
        const orderDate = new Date(order.date_time);
        switch (period) {
          case 'day':
            return orderDate.toDateString() === now.toDateString();
          case 'week':
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
            return orderDate >= startOfWeek && orderDate <= endOfWeek;
          case 'month':
            return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
          case 'year':
            return orderDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });

      const sales = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
      const quantity = filteredOrders.reduce(
        (sum, order) => sum + order.order_details.reduce((qSum, item) => qSum + item.quantity, 0),
        0
      );
      const ordersCount = filteredOrders.length;

      newFilteredData[shopId] = {
        sales,
        quantity,
        ordersCount,
        orders: filteredOrders,
        shopName: initialOrdersData[shopId].shopName,
      };
    });

    setFilteredOrdersData(newFilteredData);
    updateFilteredItemTotals(newFilteredData);
  };

  const updateFilteredItemTotals = (data) => {
    const newFilteredItemTotals = {};
  
    Object.keys(data).forEach((shopId) => {
      const shopData = data[shopId];
      const itemTotals = {};
      console.log(shopData, "shopdata");
      const orders = shopData.orders || [];
  
      orders.forEach((order) => {
        // Inicialmente, definimos details como order.order_details
        let details = order.order_details;
  
        // Si details no es un array, comprobamos si es string y tratamos de parsearlo
        if (!Array.isArray(details) && typeof details === "string") {
          try {
            const parsedDetails = JSON.parse(details);
            // Si el objeto parseado tiene una propiedad "details" que es un array, la usamos
            if (parsedDetails && Array.isArray(parsedDetails.details)) {
              details = parsedDetails.details;
            } else if (Array.isArray(parsedDetails)) {
              // En el caso de que el JSON sea directamente un array
              details = parsedDetails;
            } else {
              // Si no es ninguno de los dos casos, asignamos un array vacío
              details = [];
            }
          } catch (error) {
            console.error("Error parseando order_details:", error);
            details = [];
          }
        }
  
        // Ahora, verificamos si details es un array antes de iterar
        if (Array.isArray(details)) {
          details.forEach((item) => {
            if (!itemTotals[item.id]) {
              itemTotals[item.id] = {
                name: item.name,
                total: 0,
                quantity: 0,
                ordersCount: 0,
              };
            }
            // Convertimos el precio a número, removiendo caracteres que no sean dígitos, puntos o guiones
            itemTotals[item.id].total += parseFloat(item.price.replace(/[^0-9.-]+/g, '')) * item.quantity;
            itemTotals[item.id].quantity += item.quantity;
            itemTotals[item.id].ordersCount += 1;
          });
        }
      });
  
      newFilteredItemTotals[String(shopId)] = itemTotals;
    });
  
    setFilteredItemTotals(newFilteredItemTotals);
  };

  useEffect(() => {
    updateFilteredItemTotals(filteredOrdersData);
  }, [filteredOrdersData]);

  return (
    <div className="w-full md:py-10 md:px-8 flex flex-col items-stretch md:ml-6">
       <ShopIndicators
        ordersData={filteredOrdersData}
        filterPeriod={filterPeriod}
        filterOrders={filterOrders}
        shops={shops}
        filteredItemTotals={filteredItemTotals}
        selectedShop={selectedShop}
      /> 
    </div>
  );
};

export default ShopsComponent;
