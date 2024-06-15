import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getParamsEnv } from './../../functions/getParamsEnv.js';

const ShopsComponent = () => {
  const [shops, setShops] = useState([]);
  const [ordersData, setOrdersData] = useState({});
  const [filteredOrdersData, setFilteredOrdersData] = useState({});
  const token = useSelector((state) => state?.client.token);
  const clientId = useSelector((state) => state?.client.client.id); // Obteniendo el ID del cliente desde el estado
  const { API_URL_BASE } = getParamsEnv();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/local/byClientId`, {
          headers: {
            authorization: `Bearer ${token}`
          },
          params: {
            clients_id: clientId // Filtrando por el ID del cliente
          }
        });
        console.log('Response data:', response.data); // Añadir esto para verificar los datos recibidos
        setShops(response.data.locals);

        // Fetch orders for each shop
        response.data.locals.forEach(async (shop) => {
          const ordersResponse = await axios.get(`${API_URL_BASE}/api/orders/get/${shop.id}`, {
            headers: {
              authorization: `Bearer ${token}`
            }
          });
          setOrdersData(prevData => ({
            ...prevData,
            [shop.id]: ordersResponse.data
          }));
        });
      } catch (error) {
        console.error('Error fetching the shops data', error);
      }
    };

    if (token && clientId) {
      fetchShops(); // Solo llamar a la función si token y clientId están disponibles
    }
  }, [token, clientId, API_URL_BASE]);

  const filterOrders = (period) => {
    const now = new Date();
    const newFilteredData = {};

    Object.keys(ordersData).forEach(shopId => {
      newFilteredData[shopId] = ordersData[shopId].orders.filter(order => {
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

      // Calculate sales and contribution for filtered orders
      const sales = newFilteredData[shopId].reduce((sum, order) => sum + parseFloat(order.total_price), 0);
      const contribution = sales * 0.1; // Example: 10% of sales as contribution
      const ordersCount = newFilteredData[shopId].length;

      newFilteredData[shopId] = { sales, contribution, ordersCount, orders: newFilteredData[shopId] };
    });

    setFilteredOrdersData(newFilteredData);
  };

  const showAllOrders = () => {
    setFilteredOrdersData(ordersData);
  };

  useEffect(() => {
    setFilteredOrdersData(ordersData);
  }, [ordersData]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shops</h1>
      <div className="mt-4 flex space-x-2">
        <button onClick={() => filterOrders('day')} className="bg-blue-500 text-white px-4 py-2 rounded">Day</button>
        <button onClick={() => filterOrders('month')} className="bg-blue-500 text-white px-4 py-2 rounded">Month</button>
        <button onClick={() => filterOrders('trimester')} className="bg-blue-500 text-white px-4 py-2 rounded">Trimester</button>
        <button onClick={() => filterOrders('semester')} className="bg-blue-500 text-white px-4 py-2 rounded">Semester</button>
        <button onClick={() => filterOrders('year')} className="bg-blue-500 text-white px-4 py-2 rounded">Year</button>
        <button onClick={showAllOrders} className="bg-blue-500 text-white px-4 py-2 rounded">Historical Data</button>
      </div>
      <table className="min-w-full bg-white border border-gray-200 mt-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Sales</th>
            <th className="py-2 px-4 border-b">Contribution</th>
            <th className="py-2 px-4 border-b">Orders</th>
          </tr>
        </thead>
        <tbody>
          {shops.length > 0 ? (
            shops.map((shop) => (
              <tr key={shop.id}>
                <td className="py-2 px-4 border-b">{shop.id}</td>
                <td className="py-2 px-4 border-b">{shop.name}</td>
                <td className="py-2 px-4 border-b">{shop.address}</td>
                <td className="py-2 px-4 border-b">
                  <img src={shop.img} alt={shop.name} className="h-10 w-10 object-cover" />
                </td>
                <td className="py-2 px-4 border-b">{shop.status}</td>
                <td className="py-2 px-4 border-b">{shop.phone}</td>
                <td className="py-2 px-4 border-b">{shop.category}</td>
                <td className="py-2 px-4 border-b">{filteredOrdersData[shop.id]?.sales || 0}</td> {/* Nueva columna de ventas */}
                <td className="py-2 px-4 border-b">{filteredOrdersData[shop.id]?.contribution || 0}</td> {/* Nueva columna de contribución */}
                <td className="py-2 px-4 border-b">{filteredOrdersData[shop.id]?.ordersCount || 0}</td> {/* Nueva columna de pedidos */}
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-2 px-4 border-b" colSpan="10">No shops found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShopsComponent;
