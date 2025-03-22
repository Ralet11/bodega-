// Dashboard.jsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getParamsEnv } from './../../functions/getParamsEnv';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, LineChart, TrendingUp } from 'lucide-react';
import ShopsComponent from './dashShop';
import ProductsComponent from './dashProducts';
import DashboardSkeleton from '../DashboardSkeleton';
import TutorialCard from '../TutorialCard';
import {
  ComputerDesktopIcon,
  ShoppingCartIcon,
  BellAlertIcon,
  BuildingStorefrontIcon,
  PhoneIcon,
  CogIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import { setTutorialSeen, setTutorialStep } from '../../redux/actions/actions';

const Dashboard = () => {
  const [shops, setShops] = useState([]);
  const [ordersData, setOrdersData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('shops'); // State for the current view
  const token = useSelector((state) => state?.client?.token);
  const clientId = useSelector((state) => state?.client?.client?.id);
  const client = useSelector((state) => state?.client?.client);
  const { API_URL_BASE } = getParamsEnv();


  const dispatch = useDispatch();

  // Tutorial state from Redux
  const tutorialStep = useSelector((state) => state.tutorial?.step || 0);
  const tutorialSeen = useSelector((state) => state.tutorial.seen);
  const [showTutorial, setShowTutorial] = useState(!tutorialSeen);
  const totalSteps = 7;

  // Icon positions (adjust according to your design)
  const iconPositions = {
    0: { top: '8%', left: '70px' },    // Dashboard
    1: { top: '17%', left: '70px' },   // Products
    2: { top: '26%', left: '70px' },   // Orders
    3: { top: '35%', left: '70px' },   // Shops
    4: { top: '44%', left: '70px' },   // Contact
    5: { top: '8%', left: 'calc(100% - 520px)' }, // Shop Settings (adjust as needed)
    6: { top: '8%', left: 'calc(100% - 420px)' },  // Personal Settings (adjust as needed)
  };

  // Tutorial steps
  const tutorialSteps = [
    {
      text: 'Welcome to Bodega+. This is your Dashboard, where you can view the overall performance of your stores.',
      icon: <ComputerDesktopIcon className="w-6 h-6 text-amber-600" />,
    },
    {
      text: 'Here you can view and manage all your products.',
      icon: <ShoppingCartIcon className="w-6 h-6 text-amber-600" />,
    },
    {
      text: 'This icon takes you to the orders section where you can accept and process them.',
      icon: <BellAlertIcon className="w-6 h-6 text-amber-600" />,
    },
    {
      text: 'Create or delete your stores here.',
      icon: <BuildingStorefrontIcon className="w-6 h-6 text-amber-600" />,
    },
    {
      text: 'Contact us if you need help.',
      icon: <PhoneIcon className="w-6 h-6 text-amber-600" />,
    },
    {
      text: 'Here you can view and configure your current store.',
      icon: <CogIcon className="w-6 h-6 text-amber-600" />,
    },
    {
      text: 'From here you can edit your personal information.',
      icon: <UserIcon className="w-6 h-6 text-amber-600" />,
    },
  ];

  const handleNextStep = () => {
    if (tutorialStep < totalSteps - 1) {
      dispatch(setTutorialStep(tutorialStep + 1));
    } else {
      setShowTutorial(false);
      dispatch(setTutorialSeen());
    }
  };

  useEffect(() => {
    // 🔹 Si tutorialComplete es true, ocultamos la tarjeta de tutorial.
    if (client?.tutorialComplete) {
      setShowTutorial(false);
    }
  }, [client?.tutorialComplete]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    dispatch(setTutorialSeen());
  };

  useEffect(() => {
    if (tutorialSeen) {
      setShowTutorial(false);
    }
  }, [tutorialSeen]);

  useEffect(() => {
    const fetchShopsAndProducts = async () => {
      try {
        const shopsResponse = await axios.get(`${API_URL_BASE}/api/local/byClientId`, {
          headers: { authorization: `Bearer ${token}` },
          params: { clients_id: clientId },
        });
        setShops(shopsResponse.data.locals);

        const ordersRequests = shopsResponse.data.locals.map((shop) =>
          axios.get(`${API_URL_BASE}/api/orders/get/${shop.id}`, {
            headers: { authorization: `Bearer ${token}` },
          })
        );

        const ordersResponses = await Promise.all(ordersRequests);
        const ordersData = {};
        ordersResponses.forEach((ordersResponse, index) => {
          ordersData[shopsResponse.data.locals[index].id] = ordersResponse.data;
        });
        setOrdersData(ordersData);

        const productsResponse = await axios.get(
          `${API_URL_BASE}/api/products/getByClientId/${clientId}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
        setProducts(productsResponse.data);
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

  return (
    <div className="relative w-full mx-auto sm:p-6">
      {/* Header with animation */}


      {/* Content section */}
      <div className="w-full flex flex-col items-stretch">
        {view === 'shops' ? (
          <ShopsComponent shops={shops} ordersData={ordersData} products={products} />
        ) : (
          <ProductsComponent shops={shops} ordersData={ordersData} products={products} />
        )}
      </div>

      {/* Tutorial card */}
      {showTutorial && (
        <TutorialCard
          step={tutorialStep}
          totalSteps={totalSteps}
          onNextStep={handleNextStep}
          onCloseTutorial={handleCloseTutorial}
          iconPositions={iconPositions}
          tutorialSteps={tutorialSteps}
        />
      )}
    </div>
  );
};

export default Dashboard;
