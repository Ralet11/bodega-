import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getParamsEnv } from './../../functions/getParamsEnv';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ShopsComponent from './dashShop';

const Dashboard = () => {
  const [shops, setShops] = useState([]);
  const [ordersData, setOrdersData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const token = useSelector((state) => state?.client.token);
  const clientId = useSelector((state) => state?.client.client.id);
  const { API_URL_BASE } = getParamsEnv();

  useEffect(() => {
    const fetchShopsAndProducts = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/local/byClientId`, {
          headers: {
            authorization: `Bearer ${token}`
          },
          params: {
            clients_id: clientId
          }
        });
        setShops(response.data.locals);

        const ordersRequests = response.data.locals.map((shop) =>
          axios.get(`${API_URL_BASE}/api/orders/get/${shop.id}`, {
            headers: {
              authorization: `Bearer ${token}`
            }
          })
        );

        const ordersResponses = await Promise.all(ordersRequests);
        const ordersData = {};
        const productsMap = new Map();

        ordersResponses.forEach((ordersResponse, index) => {
          ordersData[response.data.locals[index].id] = ordersResponse.data;
          ordersResponse.data.orders.forEach(order => {
            order.order_details.forEach(item => {
              if (!productsMap.has(item.id)) {
                productsMap.set(item.id, item); // Use Map to store unique items by id
              }
            });
          });
        });

        setOrdersData(ordersData);
        setProducts(Array.from(productsMap.values())); // Convert Map values to array
      } catch (error) {
        console.error('Error fetching the shops data', error);
        setError('Failed to fetch shops data');
      } finally {
        setLoading(false);
      }
    };

    if (token && clientId) {
      fetchShopsAndProducts();
    }
  }, [token, clientId, API_URL_BASE]);

  if (loading) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center bg-blue-500 text-white p-6 mb-6 rounded-lg shadow-lg" style={{ marginTop: '120px' }}>
        <h1 className="text-4xl font-bold mb-2 animate-pulse">Welcome to Bodega Dashboard</h1>
        <p className="text-lg">Manage your shops and orders efficiently</p>
      </div>
      
      <ShopsComponent
        shops={shops}
        ordersData={ordersData}
        products={products}
      />
    </div>
  );
};

export default Dashboard;
