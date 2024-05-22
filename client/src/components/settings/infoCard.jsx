import React, { useState, useEffect } from 'react';
import { PhotoIcon } from "@heroicons/react/24/solid";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getParamsEnv } from "../../functions/getParamsEnv";

const { API_URL_BASE } = getParamsEnv();

const defaultImageUrl = 'https://via.placeholder.com/300'; // URL de la imagen por defecto

function InfoCard({ shopData, setShopData }) {
  const [newShop, setNewShop] = useState({
    id: shopData.id,
    name: '',
    phone: '',
    address: '',
    img: null,
  });
  const token = useSelector((state) => state?.client.token);

  const [selectedImage, setSelectedImage] = useState({ img: shopData.img || defaultImageUrl });
  const cat = useSelector((state) => state);

  const categories = cat.categories;

  useEffect(() => {
    setSelectedImage({ img: shopData.img || defaultImageUrl });
  }, [shopData.img]);

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
    <div className="w-full min-h-[430px] pt-6 rounded-lg bg-white text-black shadow-lg">
      <div className="flex flex-row min-h-[200px]">
        <div className="flex-1 min-h-[200px] pl-5">
          <div
            className="w-[300px] h-[300px] rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={handleImageClick}
          >
            <img
              src={selectedImage.img}
              alt="Shop"
              className="w-full h-full object-cover"
            />
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
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            Upload Image
          </button>
        </div>
        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-4">Shop Information</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newShop.name}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                Phone:
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={newShop.phone}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                Category:
              </label>
              <select
                id="category"
                name="category"
                value={newShop.category}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
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