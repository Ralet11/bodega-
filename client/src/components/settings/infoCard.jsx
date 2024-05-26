import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getParamsEnv } from "../../functions/getParamsEnv";

const { API_URL_BASE } = getParamsEnv();

const defaultImageUrl = 'https://via.placeholder.com/300';

function InfoCard({ shopData, setShopData }) {
  const [newShop, setNewShop] = useState({
    id: shopData.id,
    name: '',
    phone: '',
    address: '',
    img: null,
  });
  const token = useSelector((state) => state?.client.token);
  const [selectedImage, setSelectedImage] = useState({ img: shopData ? shopData.image : defaultImageUrl });
  const [imageChanged, setImageChanged] = useState(false);
  const categories = useSelector((state) => state.categories);

  useEffect(() => {
    setSelectedImage({ img: shopData.image || defaultImageUrl });
  }, [shopData]);

  useEffect(() => {
    setNewShop({
      id: shopData.id,
      name: shopData.name,
      phone: shopData.phone,
      img: shopData.img,
      category: shopData.category || ""
    });
  }, [shopData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShop({
      ...newShop,
      [name]: value,
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
      formData.append('image', imageFile);

      try {
        const response = await axios.post(`${API_URL_BASE}/api/up-image/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          console.log('Image uploaded successfully');
        } else {
          console.error('Error uploading image');
        }
        window.alert("Image updated");
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
      console.log(response.data);
      window.alert("Info updated");
    } catch (error) {
      console.error('Error updating shop:', error);
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
              <input
                type="text"
                id="phone"
                name="phone"
                value={newShop.phone}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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