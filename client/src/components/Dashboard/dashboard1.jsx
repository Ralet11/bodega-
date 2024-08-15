import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getParamsEnv } from './../../functions/getParamsEnv';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ShopsComponent from './dashShop';
import ProductsComponent from './dashProducts'; // Import the new component
import './dashboard.css'
import DashboardSkeleton from '../DashboardSkeleton';

const Dashboard = () => {
  const [shops, setShops] = useState([]);
  const [ordersData, setOrdersData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('shops'); // State to manage the current view
  const token = useSelector((state) => state?.client.token);
  const clientId = useSelector((state) => state?.client.client.id);
  const { API_URL_BASE } = getParamsEnv();

  

  useEffect(() => {
    const fetchShopsAndProducts = async () => {
      try {
        // Fetch shops data
        const shopsResponse = await axios.get(`${API_URL_BASE}/api/local/byClientId`, {
          headers: {
            authorization: `Bearer ${token}`
          },
          params: {
            clients_id: clientId
          }
        });
        setShops(shopsResponse.data.locals);

        // Fetch orders data for each shop
        const ordersRequests = shopsResponse.data.locals.map((shop) =>
          axios.get(`${API_URL_BASE}/api/orders/get/${shop.id}`, {
            headers: {
              authorization: `Bearer ${token}`
            }
          })
        );

        const ordersResponses = await Promise.all(ordersRequests);
        const ordersData = {};
        ordersResponses.forEach((ordersResponse, index) => {
          ordersData[shopsResponse.data.locals[index].id] = ordersResponse.data;
        });

        setOrdersData(ordersData);

        // Fetch products data for the client
        const productsResponse = await axios.get(`${API_URL_BASE}/api/products/getByClientId/${clientId}`, {
          headers: {
            authorization: `Bearer ${token}`
          }
        });

        setProducts(productsResponse.data); // Assuming the response is an array of products

      } catch (error) {
        console.error('Error fetching the data', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (token && clientId) {
      fetchShopsAndProducts();
    }
  }, [token, clientId, API_URL_BASE]);

  if (loading) {
    return <DashboardSkeleton count={5} />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  console.log(shops, "shops")

  return (
    <div className="container mx-auto p-4">
      <div className="text-center bg-gray-200 text-black p-6 mb-6 rounded-lg shadow-lg" style={{ marginTop: '120px' }}>
        <h1 className="text-4xl font-bold mb-2 fade-in">Welcome to Bodega Dashboard</h1>
        <p className="text-lg fade-in">Manage your shops and orders efficiently</p>
      </div>

      <div className="flex justify-center mb-6">
        {/* <button
          className={`px-4 py-2 mr-2 ${view === 'shops' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setView('shops')}
        >
          Shops
        </button> */}
        {/* <button
          className={`px-4 py-2 ${view === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setView('products')}
        >
          Products
        </button> */}
      </div>

      {view === 'shops' && (
        <ShopsComponent
          shops={shops}
          ordersData={ordersData}
          products={products}
        />
      )}
      {view === 'products' && (
        <ProductsComponent
          shops={shops}
          ordersData={ordersData}
          products={products}
        />
      )}
    </div>
  );
};

export default Dashboard;
