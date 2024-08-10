import React, { useMemo, useState, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, Autocomplete } from "@react-google-maps/api";
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
  height: "150px",  // Altura aún más reducida
  width: "100%",
  borderRadius: "8px",
  overflow: "hidden",
  marginBottom: "8px"  // Margen inferior más pequeño
};

const CreateFirstShop = () => {
  const client = useSelector((state) => state?.client.client);
  const token = useSelector((state) => state?.client.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB8fCVwRXbMe9FAxsrC5CsyfjzpHxowQmE",
    libraries: ["places"]
  });

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    lat: 19.432608, // Coordenadas iniciales para Ciudad de México
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
        const response = await axios.get(`${API_URL_BASE}/api/locals_categories/getAll`);
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-custom-img-2 px-2" 
           style={{ 
             backgroundRepeat: 'no-repeat', 
             backgroundPosition: 'center', 
             backgroundSize: 'cover'  // Asegura que la imagen cubra todo el fondo y esté centrada
           }}>
        <div className="w-full max-w-md p-4 bg-black rounded-md shadow-md bg-black bg-opacity-20"> {/* Tamaño máximo reducido */}
          <h1 className="text-xl font-bold mb-4 text-center text-white">Create Your First Shop</h1> {/* Tamaño de texto reducido */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3"> {/* Margen reducido */}
              <label htmlFor="name" className="block text-white text-sm">Name:</label> {/* Texto más pequeño */}
              <Input onChange={handleInputChange} id="name" placeholder="Enter your name" type="text" name="name" />
            </div>

            {/* Sección de Dirección con Mapa */}
            <div className="mb-3"> {/* Margen reducido */}
              <label htmlFor="address" className="text-white text-sm">Address:</label> {/* Texto más pequeño */}
              <div className="bg-white rounded-lg p-2"> {/* Padding reducido */}
                <div style={mapContainerStyle}>
                  <GoogleMap
                    zoom={15}
                    center={center}
                    mapContainerStyle={mapContainerStyle}
                  >
                    {/* Marcador principal donde está el usuario */}
                    <Marker
                      position={center}
                      draggable={true}
                      onDragEnd={handleMarkerDragEnd}
                    />
                    {/* Marcador azul si la dirección ha cambiado */}
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
                <div className="mt-2"> {/* Margen superior reducido */}
                  <Autocomplete onLoad={(autocomplete) => (searchResult.current = autocomplete)} onPlaceChanged={handlePlaceSelect}>
                    <Input
                      id="address"
                      placeholder="Enter your address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </Autocomplete>
                </div>
              </div>
            </div>

            <div className="mb-3"> {/* Margen reducido */}
              <label htmlFor="phone" className="text-white text-sm">Shop phone:</label> {/* Texto más pequeño */}
              <Input onChange={handleInputChange} id="phone" placeholder="Enter your phone" type="text" name="phone" />
            </div>

            <div className="mb-3"> {/* Margen reducido */}
              <label htmlFor="category" className="text-white text-sm">Category:</label> {/* Texto más pequeño */}
              <select id="category" name="category" onChange={handleInputChange} className="form-select px-1 mb-2 block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm placeholder:text-gray-400 text-sm sm:leading-6"> {/* Ajuste de padding y texto */}
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <button 
              type="button" 
              className={`w-full bg-yellow-500 text-white p-2 rounded-md focus:outline-none hover:bg-indigo-600 ${!isAddressChanged ? 'bg-gray-400 cursor-not-allowed' : ''}`}
              onClick={handleConfirmAddress}
              disabled={!isAddressChanged}
            >
              Create Shop
            </button>
          </form>
        </div>
      </div>
      <ToasterConfig />
    </>
  );
};

export default CreateFirstShop;