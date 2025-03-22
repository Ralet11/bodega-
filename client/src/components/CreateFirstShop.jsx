"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import { motion } from "framer-motion";
import axios from "axios";
import { getParamsEnv } from "../functions/getParamsEnv";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeShop, setClientLocals } from "../redux/actions/actions";
import toast from "react-hot-toast";
import ToasterConfig from "../ui_bodega/Toaster";
import {
  HiOutlineCheck,
  HiOutlineShoppingCart,
  HiOutlineCreditCard,
  HiOutlineChartBar,
} from "react-icons/hi";

import Header from "./header/Header";
const { API_URL_BASE } = getParamsEnv();

const mapContainerStyle = {
  height: "150px",
  width: "100%",
  borderRadius: "8px",
  overflow: "hidden",
  marginBottom: "12px",
};

// --------------------- Componentes ---------------------


// Barra de progreso en la barra lateral
const ProgressBar = React.memo(({ currentStep }) => {
  const steps = [
    { id: 1, name: "Create Shop", icon: HiOutlineShoppingCart },
    { id: 2, name: "Connect Stripe", icon: HiOutlineCreditCard },
    { id: 3, name: "Ready!", icon: HiOutlineCheck },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="h-0.5 w-full bg-gray-200">
            <div
              className="h-0.5 bg-amber-500 transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step.id < currentStep
                    ? "bg-amber-500"
                    : step.id === currentStep
                    ? "bg-amber-400 ring-4 ring-amber-100"
                    : "bg-gray-200"
                } transition-colors duration-300`}
              >
                <step.icon className={`h-5 w-5 ${step.id <= currentStep ? "text-white" : "text-gray-500"}`} />
              </div>
              <p className={`mt-2 text-xs font-medium ${step.id <= currentStep ? "text-gray-900" : "text-gray-500"}`}>
                {step.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Formulario para crear la tienda
const CreateShopForm = React.memo(({
  shopFormData,
  handleShopInputChange,
  handleCreateShop,
  isLoaded,
  isAddressChanged,
  center,
  categories,
  handleMarkerDragEnd,
  handlePlaceSelect,
  isLoading,
  searchResult,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-lg shadow-md"
  >
    <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Create Your First Shop</h2>
    <form onSubmit={handleCreateShop} className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Shop Name <span className="text-red-500">*</span>
        </label>
        <input
          onChange={handleShopInputChange}
          id="name"
          placeholder="Enter your shop name"
          type="text"
          name="name"
          value={shopFormData.name}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
          required
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <div className="border border-gray-300 rounded-md p-3">
          {isLoaded ? (
            <>
              <div style={mapContainerStyle}>
                <GoogleMap zoom={14} center={center} mapContainerStyle={mapContainerStyle}>
                  <Marker position={center} draggable onDragEnd={handleMarkerDragEnd} />
                </GoogleMap>
              </div>
              <div className="mt-2">
                <Autocomplete onLoad={(autocomplete) => (searchResult.current = autocomplete)} onPlaceChanged={handlePlaceSelect}>
                  <input
                    id="address"
                    placeholder="Search for your shop location"
                    name="address"
                    value={shopFormData.address}
                    onChange={handleShopInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </Autocomplete>
              </div>
            </>
          ) : (
            <div className="h-[150px] flex items-center justify-center">Loading map...</div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Phone <span className="text-red-500">*</span>
        </label>
        <input
          onChange={handleShopInputChange}
          id="phone"
          placeholder="Enter shop phone number"
          type="text"
          name="phone"
          value={shopFormData.phone}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={shopFormData.category}
          onChange={handleShopInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="col-span-2">
        <button
          type="submit"
          disabled={isLoading || !isAddressChanged}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-md flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            "Create Shop & Continue"
          )}
        </button>
      </div>
    </form>
  </motion.div>
));

// Formulario para conectar Stripe
const StripeConnectForm = React.memo(({
  stripeFormData,
  handleStripeInputChange,
  handleCreateStripeAccount,
  isLoading,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-lg shadow-md"
  >
    <h2 className="text-2xl font-semibold text-[#6772e5] mb-4">Connect with Stripe</h2>
    <form onSubmit={handleCreateStripeAccount} className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Account Name <span className="text-red-500">*</span>
        </label>
        <input
          onChange={handleStripeInputChange}
          id="accountName"
          placeholder="Your business name"
          type="text"
          name="accountName"
          value={stripeFormData.accountName}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6772e5]"
          required
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          onChange={handleStripeInputChange}
          id="email"
          placeholder="Your email address"
          type="email"
          name="email"
          value={stripeFormData.email}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6772e5]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          id="country"
          name="country"
          value={stripeFormData.country}
          onChange={handleStripeInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6772e5]"
          required
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="MX">Mexico</option>
          <option value="GB">United Kingdom</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Type <span className="text-red-500">*</span>
        </label>
        <select
          id="businessType"
          name="businessType"
          value={stripeFormData.businessType}
          onChange={handleStripeInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6772e5]"
          required
        >
          <option value="individual">Individual</option>
          <option value="company">Company</option>
          <option value="non_profit">Non-profit</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tax ID
        </label>
        <input
          onChange={handleStripeInputChange}
          id="taxId"
          placeholder="Your tax ID (optional)"
          type="text"
          name="taxId"
          value={stripeFormData.taxId}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6772e5]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          onChange={handleStripeInputChange}
          id="phoneNumber"
          placeholder="Your phone number"
          type="tel"
          name="phoneNumber"
          value={stripeFormData.phoneNumber}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6772e5]"
          required
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website
        </label>
        <input
          onChange={handleStripeInputChange}
          id="website"
          placeholder="Your website (optional)"
          type="url"
          name="website"
          value={stripeFormData.website}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6772e5]"
        />
      </div>
      <div className="col-span-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#6772e5] hover:bg-[#5469d4] text-white p-3 rounded-md flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : (
            "Connect with Stripe"
          )}
        </button>
      </div>
    </form>
  </motion.div>
));

// Pantalla de confirmación
const ConfirmationScreen = React.memo(({ shopFormData, handleFinishOnboarding }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-lg shadow-md"
  >
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
        <HiOutlineCheck className="w-10 h-10 text-green-500" />
      </div>
      <h2 className="text-2xl font-semibold text-green-600 mb-2">You're All Set!</h2>
      <p className="text-gray-600 mb-4">
        Your shop has been created and your Stripe account is connected.
      </p>
      <div className="bg-green-50 p-4 rounded-md mb-4">
        <h3 className="font-medium text-green-800 flex items-center">
          <HiOutlineShoppingCart className="mr-2 h-5 w-5" />
          Shop Created Successfully
        </h3>
        <p className="mt-1 text-sm text-green-700">
          Your shop "{shopFormData.name}" is now ready to be managed.
        </p>
      </div>
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <h3 className="font-medium text-blue-800 flex items-center">
          <HiOutlineCreditCard className="mr-2 h-5 w-5" />
          Stripe Account Connected
        </h3>
        <p className="mt-1 text-sm text-blue-700">
          Your payments are now set up and ready to receive.
        </p>
      </div>
      <div className="bg-amber-50 p-4 rounded-md mb-4">
        <h3 className="font-medium text-amber-800 flex items-center">
          <HiOutlineChartBar className="mr-2 h-5 w-5" />
          Next Steps
        </h3>
        <ul className="mt-1 text-sm text-amber-700 list-disc list-inside space-y-1">
          <li>Add your inventory items</li>
          <li>Set up your pricing</li>
          <li>Customize your shop profile</li>
          <li>Start selling and earning!</li>
        </ul>
      </div>
      <button
        onClick={handleFinishOnboarding}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-md"
      >
        Go to Dashboard
      </button>
    </div>
  </motion.div>
));

// --------------------- Componente Principal ---------------------

const OnboardingTutorial = () => {
  const client = useSelector((state) => state?.client.client);
  const token = useSelector((state) => state?.client.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  const [shopFormData, setShopFormData] = useState({
    name: "",
    address: "",
    phone: "",
    lat: 19.432608,
    lng: -99.133209,
    category: "",
    clientId: client?.id || "",
    status: "1",
  });

  const [stripeFormData, setStripeFormData] = useState({
    accountName: "",
    email: client?.email || "",
    country: "US",
    businessType: "individual",
    taxId: "",
    phoneNumber: "",
    website: "",
  });

  const [categories, setCategories] = useState([]);
  const [isAddressChanged, setIsAddressChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchResult = useRef(null);
  const center = useMemo(() => ({ lat: shopFormData.lat, lng: shopFormData.lng }), [shopFormData.lat, shopFormData.lng]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAvritMA-llcdIPnOpudxQ4aZ1b5WsHHUc",
    libraries: ["places"],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/local/getAllLocalCateogories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handlePlaceSelect = useCallback(() => {
    if (searchResult.current !== null) {
      const place = searchResult.current.getPlace();
      const location = place.geometry.location;
      const lat = location.lat();
      const lng = location.lng();

      setShopFormData((prev) => ({
        ...prev,
        address: place.formatted_address,
        lat,
        lng,
      }));
      setIsAddressChanged(true);
    } else {
      toast.error("Please enter a valid address");
    }
  }, []);

  const handleMarkerDragEnd = useCallback((event) => {
    setShopFormData((prev) => ({
      ...prev,
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }));
    setIsAddressChanged(true);
  }, []);

  const handleShopInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setShopFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "address") {
      setIsAddressChanged(true);
    }
  }, []);

  const handleStripeInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setStripeFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCreateShop = useCallback(
    async (e) => {
      e.preventDefault();
      if (!shopFormData.name || !shopFormData.address || !shopFormData.phone || !shopFormData.category) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (!isAddressChanged) {
        toast.error("Please select a valid address");
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL_BASE}/api/local/add`, shopFormData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.created === "ok") {
          toast.success("Shop created successfully!");
          dispatch(setClientLocals([response.data.result]));
          dispatch(changeShop(response.data.result.id));
          setCurrentStep(2);
        } else {
          toast.error("Error creating shop");
        }
      } catch (error) {
        console.error("Error creating shop:", error);
        toast.error("An error occurred while creating your shop");
      } finally {
        setIsLoading(false);
      }
    },
    [shopFormData, isAddressChanged, token, dispatch]
  );

  const handleCreateStripeAccount = useCallback(
    async (e) => {
      e.preventDefault();
      if (!stripeFormData.accountName || !stripeFormData.email || !stripeFormData.phoneNumber) {
        toast.error("Please fill in all required fields");
        return;
      }
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success("Stripe Connect account created successfully!");
        setCurrentStep(3);
      } catch (error) {
        console.error("Error creating Stripe account:", error);
        toast.error("An error occurred while creating your Stripe account");
      } finally {
        setIsLoading(false);
      }
    },
    [stripeFormData]
  );

  const handleFinishOnboarding = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  if (loadError) return <div>Error loading maps</div>;

  return (
    <div className="min-h-screen bg-gray-200">
      <Header isFirstScreen={true}/>
      <div className="pt-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar: Barra de progreso */}
          <aside className="md:w-1/4">
            <ProgressBar currentStep={currentStep} />
          </aside>
          {/* Área principal: Formularios */}
          <main className="md:w-3/4">
            {currentStep === 1 && (
              <CreateShopForm
                shopFormData={shopFormData}
                handleShopInputChange={handleShopInputChange}
                handleCreateShop={handleCreateShop}
                isLoaded={isLoaded}
                isAddressChanged={isAddressChanged}
                center={center}
                categories={categories}
                handleMarkerDragEnd={handleMarkerDragEnd}
                handlePlaceSelect={handlePlaceSelect}
                isLoading={isLoading}
                searchResult={searchResult}
              />
            )}
            {currentStep === 2 && (
              <StripeConnectForm
                stripeFormData={stripeFormData}
                handleStripeInputChange={handleStripeInputChange}
                handleCreateStripeAccount={handleCreateStripeAccount}
                isLoading={isLoading}
              />
            )}
            {currentStep === 3 && (
              <ConfirmationScreen
                shopFormData={shopFormData}
                handleFinishOnboarding={handleFinishOnboarding}
              />
            )}
          </main>
        </div>
      </div>
      <ToasterConfig />
    </div>
  );
};

export default OnboardingTutorial;
