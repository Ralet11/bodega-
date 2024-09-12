import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AddressMap from "./AddressMap";
import axios from 'axios';
import { getParamsEnv } from "../../functions/getParamsEnv";
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { setClientLocals } from '../../redux/actions/actions';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const { API_URL_BASE } = getParamsEnv();

const daysOfWeek = [
  { day: 'Monday', code: 'mon' },
  { day: 'Tuesday', code: 'tue' },
  { day: 'Wednesday', code: 'wed' },
  { day: 'Thursday', code: 'thu' },
  { day: 'Friday', code: 'fri' },
  { day: 'Saturday', code: 'sat' },
  { day: 'Sunday', code: 'sun' },
];

export default function HypermodernShopSettings() {
  const activeShop = useSelector((state) => state.activeShop);
  const client = useSelector((state) => state.client);
  const token = client.token;
  const categories = useSelector((state) => state.categories);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [shopData, setShopData] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
    logo: '',
    placeImage: '',
    deliveryImage: '',
    lat: null,
    lng: null,
    category: "",
    delivery: false,
    pickUp: false,
    orderIn: false,
    openingHours: daysOfWeek.map(day => ({ ...day, open: '', close: '' }))
  });

  const [latLong, setLatLong] = useState({ lat: -34.397, lng: 150.644 });
  const [isUploading, setIsUploading] = useState(false);
  const logoInputRef = useRef(null);
  const placeImageInputRef = useRef(null);
  const deliveryImageInputRef = useRef(null);
  const dispatch = useDispatch();

  // Obtener datos de la tienda
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/local/get/${activeShop}`);
        const data = response.data;
        setShopData({
          id: data.id,
          name: data.name,
          phone: data.phone,
          address: data.address,
          logo: data.logo,
          placeImage: data.placeImage,
          deliveryImage: data.deliveryImage,
          lat: data.lat,
          lng: data.lng,
          category: data.locals_categories_id || "",
          delivery: data.delivery,
          pickUp: data.pickUp,
          orderIn: data.orderIn,
          openingHours: daysOfWeek.map(day => {
            const matchedDay = data.openingHours.find(openHour => openHour.day === day.code);
            return matchedDay
              ? { ...day, open: matchedDay.open_hour, close: matchedDay.close_hour }
              : day;
          })
        });
        // Preseleccionar tags que ya están asociadas al shop
        setSelectedTags(data.tags || []); 

        setLatLong({
          lat: data.lat,
          lng: data.lng,
        });
      } catch (error) {
        toast.error('Error fetching shop data.');
        console.error('Error en la solicitud:', error);
      }
    };

    fetchData();
  }, [activeShop]);

  // Obtener tags basadas en la categoría seleccionada
  useEffect(() => {
    const fetchTags = async () => {
      if (shopData.category) {
        try {
          const response = await axios.get(`${API_URL_BASE}/api/tags/getAllByLocalCat/${shopData.category}`);
          setTags(response.data.data);
        } catch (error) {
          console.error('Error fetching tags:', error);
        }
      }
    };

    if (shopData.category) {
      fetchTags();
    }
  }, [shopData.category]);

  // Función para agregar un tag seleccionado
  const handleAddTag = (tag) => {
    event.preventDefault();
    if (!selectedTags.some((selectedTag) => selectedTag.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Función para eliminar un tag seleccionado
  const handleRemoveTag = (tagId) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShopData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOpeningHoursChange = (index, field, value) => {
    setShopData(prevState => ({
      ...prevState,
      openingHours: prevState.openingHours.map((hour, i) =>
        i === index ? { ...hour, [field]: value } : hour
      )
    }));
  };

  const handleImageUpload = async () => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append('id', shopData.id);
    formData.append('action', 'shop');

    if (logoInputRef.current.files[0]) {
      formData.append('logo', logoInputRef.current.files[0]);
    }
    if (placeImageInputRef.current.files[0]) {
      formData.append('placeImage', placeImageInputRef.current.files[0]);
    }
    if (deliveryImageInputRef.current.files[0]) {
      formData.append('deliveryImage', deliveryImageInputRef.current.files[0]);
    }

    try {
      const response = await axios.post(`${API_URL_BASE}/api/up-image/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        toast.success('Images uploaded successfully');
        const { logo, placeImage, deliveryImage } = response.data;
        setShopData(prevData => ({
          ...prevData,
          logo: logo || prevData.logo,
          placeImage: placeImage || prevData.placeImage,
          deliveryImage: deliveryImage || prevData.deliveryImage
        }));
      } else {
        toast.error('Error uploading images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error uploading images');
    }

    setIsUploading(false);
  };

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setShopData(prevData => ({
        ...prevData,
        [type]: imageUrl
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Crear el objeto con la información del shop y las tags seleccionadas
    const updatedShop = {
      id: shopData.id,
      name: shopData.name,
      phone: shopData.phone,
      logo: shopData.logo,
      placeImage: shopData.placeImage,
      deliveryImage: shopData.deliveryImage,
      category: shopData.category,
      delivery: shopData.delivery,
      pickUp: shopData.pickUp,
      orderIn: shopData.orderIn,
      tags: selectedTags.map(tag => tag.id) // Incluir las tags seleccionadas
    };
  
    try {
      // Actualizar la información del shop junto con las tags
      const response = await axios.put(`${API_URL_BASE}/api/local/update/${shopData.id}`, updatedShop, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Shop data updated successfully.');
      dispatch(setClientLocals(response.data.locals));
    } catch (error) {
      toast.error('Error updating shop data.');
      console.error('Error updating shop data', error);
    }
  
    const formattedOpeningHours = shopData.openingHours.map(hour => ({
      day: hour.code,
      open: hour.open,
      close: hour.close,
    }));
  
    try {
      await axios.post(
        `${API_URL_BASE}/api/local/updateOpeningHours`,
        {
          localId: shopData.id,
          openingHours: formattedOpeningHours
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
    } catch (error) {
      toast.error('Error saving opening hours.');
      console.error('Error saving opening hours:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-200 px-64 py-20">
      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div className="mb-6">
          <h1 className="text-3xl font-bold">Shop Settings</h1>
          <p className="text-lg text-gray-600">Set all your shop information to make it visible in the app</p>
        </motion.div>

        {/* Sección Nombre */}
        <motion.div
          className="p-4 rounded-xl shadow-md bg-white"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <label htmlFor="name" className="text-base font-semibold mb-1 block">
            Shop Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={shopData.name}
            onChange={handleChange}
            placeholder="Enter your shop name"
            className="w-full p-2 rounded-md bg-gray-100"
          />
        </motion.div>

        {/* Sección Dirección y Mapa */}
        <motion.div
          className="p-4 rounded-xl shadow-md bg-white"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <label htmlFor="address" className="text-base font-semibold mb-1 block">
            Address
          </label>
          <AddressMap setShopData={setShopData} shopData={shopData} latLong={latLong} />
        </motion.div>

        {/* Sección Teléfono */}
        <motion.div
          className="p-4 rounded-xl shadow-md bg-white"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <label htmlFor="phone" className="text-base font-semibold mb-1 block">
            Phone
          </label>
          <PhoneInput
            country={'us'}
            value={shopData.phone}
            inputClass="w-full py-1 px-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            onChange={(value) => setShopData(prevState => ({ ...prevState, phone: value }))} 
          />
        </motion.div>

        {/* Select de Categorías */}
        <motion.div className="p-4 rounded-xl shadow-md bg-white">
          <label htmlFor="category" className="text-base font-semibold mb-1 block">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={shopData.category}
            onChange={handleChange}
            className="w-full py-1 px-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Sección Tags */}
        <motion.div
  className="p-6 rounded-lg bg-gray-50 border border-gray-200"
  whileHover={{ scale: 1.01 }}
  transition={{ type: 'spring', stiffness: 200 }}
>
  <label className="text-lg font-semibold mb-4 block text-gray-700">Available Tags</label>
  
  {tags.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => handleAddTag(tag)}
          className={`py-1 px-3 rounded-full hover:bg-gray-200 transition-colors duration-200 ${
            selectedTags.some((selectedTag) => selectedTag.id === tag.id)
              ? 'bg-yellow-300 text-gray-800'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No tags for this category</p>
  )}

  {/* Mostrar tags seleccionadas */}
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-4 text-gray-700">Selected Tags</h2>
    {selectedTags.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <div
            key={tag.id}
            className="bg-yellow-100 text-gray-800 py-1 px-4 rounded-full flex items-center gap-2"
          >
            {tag.name}
            <button
              onClick={() => handleRemoveTag(tag.id)}
              className="text-black text-sm hover:text-gray-700 transition-colors duration-200"
              style={{ padding: 0, border: 'none', background: 'none' }}
            >
              &#x2715;
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No tags selected yet</p>
    )}
  </div>
</motion.div>

        {/* Sección Imágenes */}
        <motion.div
          className="p-4 rounded-xl shadow-md bg-white"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <label className="text-base font-semibold mb-4 block">Shop Images</label>
          <div className="mt-4 grid grid-cols-3 gap-6">
            {/* Logo */}
            <div className="flex flex-col items-center">
              <motion.div
                className="relative bg-gray-200 flex justify-center items-center rounded-lg w-full h-40 overflow-hidden shadow-lg group"
              >
                {shopData.logo ? (
                  <img src={shopData.logo} alt="Logo" className="object-cover h-full w-full rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="mt-2 text-sm">Add Logo</p>
                  </div>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, 'logo')}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 flex items-center justify-center transition-opacity duration-300">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 rounded-md text-black"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    Change
                  </button>
                </div>
              </motion.div>
              <p className="text-center mt-2">Logo</p>
            </div>

            {/* Place Image */}
            <div className="flex flex-col items-center">
              <motion.div
                className="relative bg-gray-200 flex justify-center items-center rounded-lg w-full h-40 overflow-hidden shadow-lg group"
              >
                {shopData.placeImage ? (
                  <img src={shopData.placeImage} alt="Place" className="object-cover h-full w-full rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="mt-2 text-sm">Add Place Image</p>
                  </div>
                )}
                <input
                  ref={placeImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, 'placeImage')}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 flex items-center justify-center transition-opacity duration-300">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 rounded-md text-black"
                    onClick={() => placeImageInputRef.current?.click()}
                  >
                    Change
                  </button>
                </div>
              </motion.div>
              <p className="text-center mt-2">Place Image</p>
            </div>

            {/* Delivery Image */}
            <div className="flex flex-col items-center">
              <motion.div
                className="relative bg-gray-200 flex justify-center items-center rounded-lg w-full h-40 overflow-hidden shadow-lg group"
              >
                {shopData.deliveryImage ? (
                  <img src={shopData.deliveryImage} alt="Delivery" className="object-cover h-full w-full rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="mt-2 text-sm">Add Delivery Image</p>
                  </div>
                )}
                <input
                  ref={deliveryImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, 'deliveryImage')}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 flex items-center justify-center transition-opacity duration-300">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 rounded-md text-black"
                    onClick={() => deliveryImageInputRef.current?.click()}
                  >
                    Change
                  </button>
                </div>
              </motion.div>
              <p className="text-center mt-2">Delivery Image</p>
            </div>
          </div>
          {/* Botón para subir las imágenes con loader */}
          <div className="mt-4 flex justify-end">
            {isUploading ? (
              <div className="loader">Uploading...</div>
            ) : (
              <button
                type="button"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={handleImageUpload}
              >
                Upload Images
              </button>
            )}
          </div>
        </motion.div>

        {/* Sección Horarios de Atención */}
        <motion.div
          className="p-4 rounded-xl shadow-md bg-white"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <label className="text-base font-semibold mb-1 block">Working Hours</label>
          <div className="grid grid-cols-3 gap-4">
            {shopData.openingHours.map((day, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-gray-600 text-sm font-medium">{day.day}</label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={day.open}
                    onChange={(e) => handleOpeningHoursChange(index, 'open', e.target.value)}
                    className="p-2 rounded-md bg-gray-100"
                  />
                  <input
                    type="time"
                    value={day.close}
                    onChange={(e) => handleOpeningHoursChange(index, 'close', e.target.value)}
                    className="p-2 rounded-md bg-gray-100"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sección Servicios */}
        <motion.div
          className="p-4 rounded-xl shadow-md bg-white"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <label className="text-base font-semibold mb-1 block">Services</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="delivery"
                checked={shopData.delivery}
                onChange={handleChange}
                className="p-2 rounded-md bg-gray-100"
              />
              <label>Delivery</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="pickUp"
                checked={shopData.pickUp}
                onChange={handleChange}
                className="p-2 rounded-md bg-gray-100"
              />
              <label>Pick-up</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="orderIn"
                checked={shopData.orderIn}
                onChange={handleChange}
                className="p-2 rounded-md bg-gray-100"
              />
              <label>Order In</label>
            </div>
          </div>
        </motion.div>

        {/* Botón Guardar Cambios */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button
            type="submit"
            className="w-full mb-20 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-md hover:from-blue-500 hover:to-blue-700"
          >
            Save Changes
          </button>
        </motion.div>
      </form>
    </div>
  );
}
