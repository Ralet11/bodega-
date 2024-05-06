import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar, { SidebarItem } from './components/sidebar/Sidebar';
import Header from './components/header/Header';
import "./App.css"
import { ShoppingCartIcon, BellAlertIcon, BuildingStorefrontIcon, PhoneIcon, ComputerDesktopIcon, WalletIcon, TicketIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import Login from './components/login/login';
import { Link } from 'react-router-dom';
import Products from './components/products/Products';
import Shops from './components/shops/shops';
import Orders from './components/orders/orders';
import Dashboard1 from './components/Dashboard/dashboard1';
import { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import OrdersHistory from './components/orders_history/OrdersHistory';
import Settings from './components/settings/Settings';
import { setNewOrder } from './redux/actions/actions';
import { useDispatch } from 'react-redux';
import Landing from './components/Landing/Landing';
import Discounts from './components/Discounts/Discounts';
import DistributorComerce from './components/DistributorComerce/DistributorComerce';
import { getParamsEnv } from './functions/getParamsEnv';
import DistProdCard from './components/card/CardBodega';



function App() {
  const location = useLocation();
  const dispatch = useDispatch()

  // Renderiza la barra lateral y el encabezado solo si la ruta actual no es '/'
  const renderSidebarAndHeader = location.pathname !== '/' && location.pathname !== '/login';
  const [orderNotificationCount, setOrderNotificationCount] = useState(0); // Estado para el contador de notificaciones
  const socket = socketIOClient("http://localhost:80");

  useEffect(() => {
    socket.on("newOrder", (data) => {
      console.log("entro nueva orden");
      setOrderNotificationCount((prevCount) => prevCount + 1);
      dispatch(setNewOrder(true));
    });
  
    // Limpia el evento cuando el componente se desmonta
    return () => {
      socket.off("newOrder");
    };
  }, []);

  const handleOrdersClick = () => {
    setOrderNotificationCount(0); // Restablece el contador a cero
  };

  return (
    <div className="flex flex-col h-screen">
      {renderSidebarAndHeader && (
        <>
          <Sidebar className="sidebar">
            <Link to="/dashboard">
              <SidebarItem icon={<ComputerDesktopIcon className="w-6" />} text="Dashboard" />
            </Link>
            <Link to="/products">
              <SidebarItem icon={<ShoppingCartIcon className="w-6" />} text="Products" />
            </Link>
            <Link to="/discounts">
              <SidebarItem icon={<TicketIcon className="w-6" />} text="Discounts" />
            </Link>
            <Link to="/orders">
              <SidebarItem
                icon={<BellAlertIcon className="w-6" />}
                text="Orders"
                notificationCount={orderNotificationCount} // Pasa el contador como prop
                onClick={handleOrdersClick} // Restablece el contador al hacer clic
              />
              <Link to="/history">
              <SidebarItem icon={<WalletIcon className="w-6" />} text="History" />
            </Link>
            </Link>
            <Link to="/shops">
              <SidebarItem icon={<BuildingStorefrontIcon className="w-6" />} text="Shops" />
            </Link>
            <Link to="/contact">
              <SidebarItem icon={<PhoneIcon className="w-6" />} text="Contact" />
            </Link>
            <Link to="/distributorsCommerce">
              <SidebarItem icon={<ShoppingBagIcon className="w-6" />} text="Distributors Offers" />
            </Link>
          </Sidebar>
          {/* Header */}
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
        <Route path='settings' element={<Settings />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/discounts' element={<Discounts />}></Route>
        <Route path='/distributorsCommerce' element={<DistributorComerce />}></Route>
        <Route path='/distProduct-detail' element={<DistProdCard />}></Route>
      </Routes>
    </div>
  );
}

export default App