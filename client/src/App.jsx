import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import axios from "axios";
import "./App.css";

// Components
import Sidebar, { SidebarItem } from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import Landing from "./components/Landing/Landing";
import Login from "./components/login/Login.jsx";
import NuevoLogin from "./components/NuevoLogin.jsx";
import Dashboard1 from "./components/Dashboard/dashboard1";
import Products from "./components/products/Products";
import Shops from "./components/shops/Shops";
import Orders from "./components/orders/orders";
import OrdersHistory from "./components/orders_history/OrdersHistory";
import Settings from "./components/settings/Settings";
import Discounts from "./components/Discounts/Discounts";
import DistributorComerce from "./components/DistributorComerce/DistributorComerce";
import DistProdCard from "./components/card/CardBodega";
import CartView from "./components/cartView/CartView";
import SuccessPaymentDist from "./components/SuccesPaymentDist.jsx";
import SignUp from "./components/SignUp.jsx";
import DistPurchaseHistory from "./components/DistPurchaseHistory.jsx";
import CreateFirstShop from "./components/CreateFirstShop.jsx";
import ContactForm from "./components/contact/Contact.jsx";
import FindedProducts from "./components/DistributorComerce/FindedProducts.jsx";
import PrivacyPolicy from "./components/PoliciPrivacy.jsx";
import DeleteInfoUserForm from "./components/DeleteInfoUsers.jsx";
import ErrorPage from "./components/ErrorView.jsx";
import ClientSettings from "./components/settings/ClientSettings.jsx";
import SellersPanel from "./components/SellersPanel.jsx";
import OrderAccepted from "./components/AcceptOrder.jsx";
import SellerSettings from "./components/SellersSettings.jsx";

// Protected route wrappers
import OwnerProtectedRoute from "./components/OwnerRoutes.jsx";
import SellerProtectedRoute from "./components/SellerRout.jsx";

// Redux actions
import { setCategories, setNewOrder } from "./redux/actions/actions";
import { getParamsEnv } from "./functions/getParamsEnv.js";

// Icons
import {
  ShoppingCartIcon,
  BellAlertIcon,
  BuildingStorefrontIcon,
  PhoneIcon,
  ComputerDesktopIcon
} from "@heroicons/react/24/solid";

const { API_URL_BASE } = getParamsEnv();

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux states
  const token = useSelector((state) => state?.client?.token);
  const activeShop = useSelector((state) => state.activeShop);
  const client = useSelector((state) => state?.client?.client);
  const userRole = client?.role; // e.g. 0 or 1

  // Socket for real-time updates
  const socket = socketIOClient("https://3.137.165.92");

  // Local states
  const [orderNotificationCounts, setOrderNotificationCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Decide when to show sidebar/header
  // Now also exclude "/error"
  const renderSidebarAndHeader =
    location.pathname !== "/" &&
    location.pathname !== "/login" &&
    location.pathname !== "/sellerSettings" &&
    location.pathname !== "/sellersPanel" &&
    location.pathname !== "/register" &&
    location.pathname !== "/create-shop" &&
    location.pathname !== "/privacyPolicy" &&
    location.pathname !== "/deleteUserInfoForm" &&
    location.pathname !== "/error";

  // Socket: handle new orders
  useEffect(() => {
    socket.on("neworder", (data) => {
      setOrderNotificationCounts((prevCounts) => ({
        ...prevCounts,
        [data.local_id]: (prevCounts[data.local_id] || 0) + 1,
      }));
      dispatch(setNewOrder(true));
    });

    return () => {
      socket.off("neworder");
    };
  }, [dispatch]);

  // Reset notification count when clicking orders
  const handleOrdersClick = () => {
    setOrderNotificationCounts((prevCounts) => ({
      ...prevCounts,
      [activeShop]: 0,
    }));
  };

  // Load categories, redirect if necessary
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_URL_BASE}/api/local/getAllLocalCateogories`
        );
        dispatch(setCategories(response.data));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    const protectedRoutes = [
      "/dashboard",
      "/products",
      "/shops",
      "/orders",
      "/history",
      "/settings",
      "/discounts",
      "/distributorsCommerce",
      "/distProduct-detail",
      "/cartView",
      "/succesPaymentDist",
      "/distHistoryBuy",
      "/create-shop",
      "/contact",
    ];

    if (!token && protectedRoutes.includes(location.pathname)) {
      navigate("/login");
    }
  }, [dispatch, token, location.pathname, navigate, activeShop]);

  return (
    <div className="flex flex-col h-screen">
      {renderSidebarAndHeader && (
        <>
          <Sidebar className="sidebar">
            {/* Routes allowed for owners (role=0) - visible if you want them
                to appear in the sidebar always or based on conditions */}
            <SidebarItem
              icon={<ComputerDesktopIcon className="w-2" />}
              text="Dashboard"
              link="/dashboard"
            />
            <SidebarItem
              icon={<ShoppingCartIcon className="w-2" />}
              text="Products"
              link="/products"
            />
            <SidebarItem
              icon={<BellAlertIcon className="w-2" />}
              text="Orders"
              notificationCount={orderNotificationCounts[activeShop] || 0}
              onClick={handleOrdersClick}
              link="/orders"
            />
            <SidebarItem
              icon={<BuildingStorefrontIcon className="w-2" />}
              text="Shops"
              link="/shops"
            />
            <SidebarItem
              icon={<PhoneIcon className="w-2" />}
              text="Contact"
              link="/contact"
            />
          </Sidebar>
          <Header className="header" />
        </>
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<NuevoLogin />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/deleteUserInfoForm" element={<DeleteInfoUserForm />} />
        <Route path="/error" element={<ErrorPage />} />

        {/* Owner-only routes (role = 0) */}
        <Route
          path="/dashboard"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <Dashboard1 />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <Products />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/shops"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <Shops />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <Orders />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <OrdersHistory />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <Settings />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/discounts"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <Discounts />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/distributorsCommerce"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <DistributorComerce />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/distProduct-detail"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <DistProdCard />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/cartView"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <CartView />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/succesPaymentDist"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <SuccessPaymentDist />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/distHistoryBuy"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <DistPurchaseHistory />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/create-shop"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <CreateFirstShop />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <ContactForm />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/searchProducts"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <FindedProducts />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/clientSettings"
          element={
            <OwnerProtectedRoute userRole={userRole}>
              <ClientSettings />
            </OwnerProtectedRoute>
          }
        />

        {/* Seller-only routes (role = 1) */}
        <Route
          path="/sellersPanel"
          element={
            <SellerProtectedRoute userRole={userRole}>
              <SellersPanel />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/sellerSettings"
          element={
            <SellerProtectedRoute userRole={userRole}>
              <SellerSettings />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/order-accepted"
          element={
            <SellerProtectedRoute userRole={userRole}>
              <OrderAccepted />
            </SellerProtectedRoute>
          }
        />

        {/* Catch-all for unknown paths */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
