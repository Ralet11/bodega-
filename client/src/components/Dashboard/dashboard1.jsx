import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getParamsEnv } from './../../functions/getParamsEnv';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ShopsComponent from './ShopsComponent';
import ProductsComponent from './dashProducts'; // Import the new component

const Dashboard = () => {
  const [shops, setShops] = useState([]);
  const [ordersData, setOrdersData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState(null); // State to manage the current view
  const [isHovered, setIsHovered] = useState(null);

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

  const handleMouseEnter = (id) => {
    setIsHovered(id);
  };

  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  if (loading) {
    return <Skeleton count={5} />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const styles = {
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '24px',
    },
    button: {
      padding: '12px 24px',
      marginRight: '8px',
      borderRadius: '8px',
      width: '100px',
      height: '100px',
      backgroundColor: '#e0e0e0',
      color: '#333',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#ccc',
      color: '#000',
    },
    buttonActive: {
      backgroundColor: '#333',
      color: '#fff',
    },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center bg-gray-800 text-white p-6 mb-6 rounded-lg shadow-md" style={{ marginTop: '120px' }}>
        <h1 className="text-4xl font-bold mb-2 animate-bounce">Welcome to Bodega Dashboard</h1>
        <p className="text-lg">Manage your shops and orders efficiently</p>
      </div>
      <div style={styles.buttonContainer}>
        <button
          style={{
            ...styles.button,
            ...(view === 'shops' ? styles.buttonActive : {}),
            ...(isHovered === 'shops' ? styles.buttonHover : {}),
          }}
          onMouseEnter={() => handleMouseEnter('shops')}
          onMouseLeave={handleMouseLeave}
          onClick={() => setView('shops')}
        >
          Shops
        </button>
        
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
