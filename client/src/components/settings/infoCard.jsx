import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getParamsEnv } from "../../functions/getParamsEnv";
import ToasterConfig from '../../ui_bodega/Toaster';
import toast from 'react-hot-toast';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const { API_URL_BASE } = getParamsEnv();

const defaultImageUrl = 'https://via.placeholder.com/300';

// Lista de países con características adicionales
const countryOptions = [
  { value: 'AR', label: 'Argentina', code: '+54' },
  { value: 'BR', label: 'Brazil', code: '+55' },
  { value: 'US', label: 'United States', code: '+1' },
  // Agrega más países según sea necesario
];

function InfoCard({ shopData, setShopData }) {
  const [newShop, setNewShop] = useState({
    id: shopData.id,
    name: '',
    phone: '',
    address: '',
    img: null,
    nationality: '',
    service_options: ['0', '1'],
  });
  const token = useSelector((state) => state?.client.token);
  const [selectedImage, setSelectedImage] = useState({ img: shopData ? shopData.image : defaultImageUrl });
  const [imageChanged, setImageChanged] = useState(false);
  const categories = useSelector((state) => state.categories);
  const [phonePrefix, setPhonePrefix] = useState('');

  useEffect(() => {
    setSelectedImage({ img: shopData.image || defaultImageUrl });
  }, [shopData]);

  useEffect(() => {
    setNewShop({
      id: shopData.id,
      name: shopData.name,
      phone: shopData.phone,
      img: shopData.img,
      category: shopData.category || "",
      nationality: shopData.nationality || "",
      service_options: shopData.service_options || ["0", "1"],
    });
    const selectedCountry = countryOptions.find(option => option.value === shopData.nationality);
    setPhonePrefix(selectedCountry ? selectedCountry.code : '');
  }, [shopData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShop({
      ...newShop,
      [name]: value,
    });
  };

  const handlePhoneChange = (value) => {
    setNewShop({
      ...newShop,
      phone: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage({ img: imageUrl });
      setImageChanged(true);
    }
  };

  const handleImageClick = () => {
    document.getElementById('imageInput').click();
  };

  async function convertBlobUrlToImageFile(blobUrl) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const filename = 'image.png';
    return new File([blob], filename);
  }

  const handleImageUpload = async () => {
    if (selectedImage) {
      const imageFile = await convertBlobUrlToImageFile(selectedImage.img);

      const formData = new FormData();
      formData.append('id', newShop.id);
      formData.append('action', 'shop');
      formData.append('file', imageFile);

      try {
        const response = await axios.post(`${API_URL_BASE}/api/up-image/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          toast.success("Image uploaded successfully"); // Mostrar Toast de éxito
          console.log('Image uploaded successfully');
        } else {
          console.error('Error uploading image');
        }
        setImageChanged(false);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleChangeShop = async () => {
    try {
      const response = await axios.put(`${API_URL_BASE}/api/local/update/${shopData.id}`, newShop, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        toast.success("Shop information updated successfully"); // Mostrar Toast de éxito
      } else {
        toast.error("Error updating shop information");
        console.error('Error updating shop information');
      }
    } catch (error) {
      toast.error("Error updating shop information");
      console.error('Error updating shop:', error);
    }
  };

  const handleNationalityChange = (selectedOption) => {
    setNewShop({
      ...newShop,
      nationality: selectedOption.value,
    });
    setPhonePrefix(selectedOption.code);
  };

  const handleServiceChange = async (service, checked) => {
    try {
      const url = `${API_URL_BASE}/api/local/${checked ? 'addService' : 'removeService'}/${newShop.id}`;
      const response = await axios.post(url, { serviceToAdd: service, serviceToRemove: service }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response)
      if (response.status === 200) {
        const updatedServices = checked
          ? [...newShop.service_options, service]
          : newShop.service_options.filter(option => option !== service);
        setNewShop({
          ...newShop,
          service_options: updatedServices,
        });
        toast.success(`Service ${checked ? 'added' : 'removed'} successfully`);
      } else {
        toast.error(`Error ${checked ? 'adding' : 'removing'} service`);
        console.error(`Error ${checked ? 'adding' : 'removing'} service`);
      }
    } catch (error) {
      toast.error(`Error ${checked ? 'adding' : 'removing'} service`);
      console.error(`Error ${checked ? 'adding' : 'removing'} service`, error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex-1 p-4">
          <div
            className="w-full h-64 rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 relative group shadow-lg"
            onClick={handleImageClick}
          >
            <img
              src={selectedImage.img}
              alt="Shop"
              className="object-cover w-full h-full rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white font-bold">Change Image</span>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="imageInput"
            className="hidden"
          />
          <button
            onClick={handleImageUpload}
            disabled={!imageChanged}
            className={`mt-4 w-full text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 ${imageChanged ? 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Save Image
          </button>
        </div>
        <div className="flex-1 p-4">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Shop Information</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-500 text-sm font-medium mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newShop.name}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-500 text-sm font-medium mb-2">
                Phone:
              </label>
              <PhoneInput
                country={'us'}
                value={newShop.phone}
                onChange={handlePhoneChange}
                inputClass="w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-500 text-sm font-medium mb-2">
                Category:
              </label>
              <select
                id="category"
                name="category"
                value={newShop.category}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="services" className="block text-gray-500 text-sm font-medium mb-2">
                Services:
              </label>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={newShop.service_options.includes('0')}
                    onChange={(e) => handleServiceChange('0', e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Pick-up</span>
                </label>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={newShop.service_options.includes('1')}
                    onChange={(e) => handleServiceChange('1', e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Delivery</span>
                </label>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={newShop.service_options.includes('2')}
                    onChange={(e) => handleServiceChange('2', e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Order-in</span>
                </label>
              </div>
            </div>
            <button
              onClick={handleChangeShop}
              type="button"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;