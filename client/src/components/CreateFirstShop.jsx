import React, { useMemo, useState, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import { motion } from "framer-motion";
import axios from "axios";
import { getParamsEnv } from "../functions/getParamsEnv";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeShop, setClientLocals } from '../redux/actions/actions';
import Header from './header/Header';
import Input from "../ui_bodega/Input";
import toast from 'react-hot-toast';
import ToasterConfig from '../ui_bodega/Toaster';

const { API_URL_BASE } = getParamsEnv();

const mapContainerStyle = {
  height: "150px", // Tamaño reducido
  width: "100%",
  borderRadius: "8px",
  overflow: "hidden",
  marginBottom: "12px"
};

const CreateFirstShop = () => {
  const client = useSelector((state) => state?.client.client);
  const token = useSelector((state) => state?.client.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAvritMA-llcdIPnOpudxQ4aZ1b5WsHHUc",
    libraries: ["places"]
  });

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    lat: 19.432608,
    lng: -99.133209,
    category: '',
    clientId: client?.id || "",
    status: '1'
  });

  const [categories, setCategories] = useState([]);
  const [isAddressChanged, setIsAddressChanged] = useState(false);
  const searchResult = useRef(null);
  const center = useMemo(() => ({ lat: formData.lat, lng: formData.lng }), [formData.lat, formData.lng]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/local/getAllLocalCateogories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handlePlaceSelect = () => {
    if (searchResult.current !== null) {
      const place = searchResult.current.getPlace();
      const location = place.geometry.location;
      const lat = location.lat();
      const lng = location.lng();

      setFormData({
        ...formData,
        address: place.formatted_address,
        lat,
        lng
      });
      setIsAddressChanged(true);
    } else {
      alert("Por favor, ingresa una dirección válida");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === "address") {
      setIsAddressChanged(true);
    }
  };

  const handleMarkerDragEnd = (event) => {
    setFormData({
      ...formData,
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setIsAddressChanged(true);
  };

  const handleConfirmAddress = async () => {
    if (!formData.address || !formData.lat || !formData.lng) {
      window.alert("Por favor, ingresa una dirección válida.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL_BASE}/api/local/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.created === "ok") {
        toast.success("Tienda creada exitosamente.");
        dispatch(setClientLocals([response.data.result]));
        dispatch(changeShop(response.data.result.id));
        navigate("/dashboard");
      } else {
        window.alert("Error creando la tienda.");
      }
    } catch (error) {
      console.error('Error creando la tienda:', error);
      window.alert("Ocurrió un error al crear la tienda.");
    }
  };

  if (loadError) return <div>Error cargando mapas</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen mt-20 bg-gray-200 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg mx-auto mt-20 mb-20"
        >
          {/* Welcome Message */}
          <div className="text-center mt-20 mb-8">
            <h2 className="text-2xl font-semibold text-yellow-600 mb-2">
              Welcome to BODEGA+
            </h2>
            <p className="text-gray-600 text-sm">
              To get started with your business management journey, you'll need to create your first shop.
              This will unlock access to all our powerful features and tools.
            </p>
          </div>

          <div className="p-4 bg-gray-100 border mb-10 border-gray-300 rounded-md shadow-sm">
            <h4 className="text-xl font-medium text-gray-700 mb-4">
              Create Your First Shop
            </h4>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Shop Name
                </label>
                <Input
                  onChange={handleInputChange}
                  id="name"
                  placeholder="Enter your shop name"
                  type="text"
                  name="name"
                  className="w-full bg-white border border-gray-300 rounded-md text-gray-700 p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Location
                </label>
                <div className="bg-white border border-gray-300 rounded-md p-3">
                  <div style={mapContainerStyle}>
                    <GoogleMap
                      zoom={14}
                      center={center}
                      mapContainerStyle={mapContainerStyle}
                    >
                      <Marker
                        position={center}
                        draggable={true}
                        onDragEnd={handleMarkerDragEnd}
                      />
                      {isAddressChanged && (
                        <Marker
                          position={{ lat: formData.lat, lng: formData.lng }}
                          icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                          }}
                        />
                      )}
                    </GoogleMap>
                  </div>
                  <div className="mt-2">
                    <Autocomplete
                      onLoad={(autocomplete) => (searchResult.current = autocomplete)}
                      onPlaceChanged={handlePlaceSelect}
                    >
                      <Input
                        id="address"
                        placeholder="Search for your shop location"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded-md text-gray-700 p-2 text-sm"
                      />
                    </Autocomplete>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Contact Phone
                </label>
                <Input
                  onChange={handleInputChange}
                  id="phone"
                  placeholder="Enter shop phone number"
                  type="text"
                  name="phone"
                  className="w-full bg-white border border-gray-300 rounded-md text-gray-700 p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Business Category
                </label>
                <select
                  id="category"
                  name="category"
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-300 text-gray-700 rounded-md p-2 text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleConfirmAddress}
                disabled={!isAddressChanged}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white p-2 rounded-md text-sm"
              >
                Create Shop
              </button>

              <p className="text-center text-gray-500 mt-2 text-xs">
                Make sure all information is correct before creating your shop
              </p>
            </form>
          </div>
        </motion.div>
      </div>
      <ToasterConfig />
    </>
  );
};

export default CreateFirstShop;
