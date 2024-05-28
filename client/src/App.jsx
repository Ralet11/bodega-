import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar, { SidebarItem } from './components/sidebar/Sidebar';
import Header from './components/header/Header';
import "./App.css";
import { ShoppingCartIcon, BellAlertIcon, RectangleStackIcon, BuildingStorefrontIcon, PhoneIcon, ComputerDesktopIcon, WalletIcon, TicketIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import Login from './components/login/Login.jsx';
import Products from './components/products/Products';
import Shops from './components/shops/Shops.jsx';
import Orders from './components/orders/orders';
import Dashboard1 from './components/Dashboard/dashboard1';
import { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import OrdersHistory from './components/orders_history/OrdersHistory';
import Settings from './components/settings/Settings';
import { setCategories, setNewOrder } from './redux/actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import Landing from './components/Landing/Landing';
import Discounts from './components/Discounts/Discounts';
import DistributorComerce from './components/DistributorComerce/DistributorComerce';
import DistProdCard from './components/card/CardBodega';
import CartView from './components/cartView/CartView';
import SuccessPaymentDist from './components/SuccesPaymentDist.jsx';
import SignUp from './components/SignUp.jsx';
import DistPurchaseHistory from './components/DistPurchaseHistory.jsx';
import CreateFirstShop from './components/CreateFirstShop.jsx';
import NuevoLogin from './components/NuevoLogin.jsx';
import ContactForm from './components/contact/Contact.jsx';
import axios from 'axios';
import { getParamsEnv } from './functions/getParamsEnv.js';
import Loader from './components/Loader'; // Importa el nuevo componente Loader

const { API_URL_BASE } = getParamsEnv();

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.client?.token);
  const renderSidebarAndHeader = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/create-shop';
  const [orderNotificationCount, setOrderNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const socket = socketIOClient("http://localhost:80");

  useEffect(() => {
    socket.on("newOrder", (data) => {
      setOrderNotificationCount((prevCount) => prevCount + 1);
      dispatch(setNewOrder(true));
    });

    return () => {
      socket.off("newOrder");
    };
  }, [dispatch]);

  const handleOrdersClick = () => {
    setOrderNotificationCount(0);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(`${API_URL_BASE}/api/locals_categories/getAll`);
      console.log(response.data, "llamando categorias");
      dispatch(setCategories(response.data));
    };

    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    const protectedRoutes = [
      '/dashboard', '/products', '/shops', '/orders', 
      '/history', '/settings', '/discounts', 
      '/distributorsCommerce', '/distProduct-detail', 
      '/cartView', '/succesPaymentDist', '/distHistoryBuy', 
      '/create-shop', '/contact'
    ];

    if (!token && protectedRoutes.includes(location.pathname)) {
      navigate("/login");
    }
  }, [token, location.pathname, navigate]);

  return (
    <div className="flex flex-col h-screen">
      {renderSidebarAndHeader && (
        <>
          <Sidebar className="sidebar">
            <SidebarItem icon={<ComputerDesktopIcon className="w-2" />} text="Dashboard" link="/dashboard" />
            <SidebarItem icon={<ShoppingCartIcon className="w-2" />} text="Products" link="/products" />
           {/*  <SidebarItem
              icon={<BellAlertIcon className="w-2" />}
              text="Orders"
              notificationCount={orderNotificationCount}
              onClick={handleOrdersClick}
              link="/orders"
            /> */}
            <SidebarItem icon={<ShoppingBagIcon className="w-2" />} text="Market" link="/distributorsCommerce" />
            <SidebarItem icon={<WalletIcon className="w-2" />} text="History" link="/history" />
            <SidebarItem icon={<BuildingStorefrontIcon className="w-2" />} text="Shops" link="/shops" />
            <SidebarItem icon={<PhoneIcon className="w-2" />} text="Contact" link="/contact" />
            <SidebarItem icon={<RectangleStackIcon className="w-2" />} text="Your buys" link="/distHistoryBuy" />
          </Sidebar>
          <Header className="header" />
        </>
      )}
      <Routes>
        <Route path='/' element={<Landing />}></Route>
        <Route path='/dashboard' element={<Dashboard1 />}></Route>
        <Route path='/products' element={<Products />}></Route>
        <Route path='/shops' element={<Shops />}></Route>
        <Route path='/orders' element={<Orders />}></Route>
        <Route path='/history' element={<OrdersHistory />}></Route>
        <Route path='/settings' element={<Settings />}></Route>
        <Route path='/login' element={<NuevoLogin />}></Route>
        <Route path='/discounts' element={<Discounts />}></Route>
        <Route path='/distributorsCommerce' element={<DistributorComerce />}></Route>
        <Route path='/distProduct-detail' element={<DistProdCard />}></Route>
        <Route path='/cartView' element={<CartView />}></Route>
        <Route path='/succesPaymentDist' element={<SuccessPaymentDist />}></Route>
        <Route path='/register' element={<SignUp />}></Route>
        <Route path='/distHistoryBuy' element={<DistPurchaseHistory />}></Route>
        <Route path='/create-shop' element={<CreateFirstShop />}></Route>
        <Route path='/contact' element={<ContactForm />}></Route>
      </Routes>
    </div>
  );
}

export default App;