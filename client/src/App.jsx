import { Routes, Route, useLocation, Link } from 'react-router-dom';
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
import { setNewOrder } from './redux/actions/actions';
import { useDispatch } from 'react-redux';
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

function App() {
  const location = useLocation();
  const dispatch = useDispatch()

  // Renderiza la barra lateral y el encabezado solo si la ruta actual no es '/'
  const renderSidebarAndHeader = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/create-shop';
  const [orderNotificationCount, setOrderNotificationCount] = useState(0); // Estado para el contador de notificaciones
  const socket = socketIOClient("https://3.15.211.38");

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
            <SidebarItem icon={<ComputerDesktopIcon className="w-6" />} text="Dashboard" link="/dashboard" />
            <SidebarItem icon={<ShoppingCartIcon className="w-6" />} text="Products" link="/products" />
            <SidebarItem
              icon={<BellAlertIcon className="w-6" />}
              text="Orders"
              notificationCount={orderNotificationCount}
              onClick={handleOrdersClick}
              link="/orders"
            />
            <SidebarItem icon={<WalletIcon className="w-6" />} text="History" link="/history" />
            <SidebarItem icon={<BuildingStorefrontIcon className="w-6" />} text="Shops" link="/shops" />
            <SidebarItem icon={<PhoneIcon className="w-6" />} text="Contact" link="/contact" />
            <SidebarItem icon={<ShoppingBagIcon className="w-6" />} text="Market" link="/distributorsCommerce" />
            <SidebarItem icon={<RectangleStackIcon className="w-6" />} text="Your buys" link="/distHistoryBuy" />
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
        <Route path='settings' element={<Settings />}></Route>
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
