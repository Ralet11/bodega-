import React, { useState, useEffect } from 'react';
import { PhotoIcon } from "@heroicons/react/24/solid";
import axios from 'axios';

function InfoCard({ shopData, setShopData }) {
  const [newShop, setNewShop] = useState({
    id: shopData.id,
    name: '',
    phone: '',
    address: '',
    img: null,
  });

  const [selectedImage, setSelectedImage] = useState({ img: shopData.image });

  useEffect(() => {
    setSelectedImage({ img: shopData.image });
  }, [shopData.image]);

  // Update newShop when shopData changes
  useEffect(() => {
    setNewShop({
      id: shopData.id,
      name: shopData.name,
      phone: shopData.phone,
      img: shopData.img,
    });
  }, [shopData]);

  // Handle changes in the input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShop({
      ...newShop,
      [name]: value,
    });
  };

  // Handle changes in the selected image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage({ img: imageUrl });
    }
  };

  // Open file input dialog
  const handleImageClick = () => {
    document.getElementById('imageInput').click();
  };

  async function convertBlobUrlToImageFile(blobUrl) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const filename = 'image.png'; // Puedes cambiar el nombre del archivo si es necesario
    return new File([blob], filename);
  }

  // Upload selected image
  const handleImageUpload = async () => {
    if (selectedImage) {
      const imageFile = await convertBlobUrlToImageFile(selectedImage.img);

      const formData = new FormData();
      formData.append('id', newShop.id);
      formData.append('action', 'shop');
      formData.append('image', imageFile);

      try {
        const response = await axios.post('http://localhost:3000/api/up-image/', formData);
        if (response.status === 200) {
          console.log('Image uploaded successfully');
        } else {
          console.error('Error uploading image');
        }
        window.alert("image updated")
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };


  // Handle shop update
  const handleChangeShop = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/api/local/update/${shopData.id}`, newShop);
      console.log(response.data);
      window.alert("Info updated")
    } catch (error) {
      console.error('Error updating shop:', error);
    }
  };
  return (
    <div className="w-full min-h-[430px] pt-[30px] rounded-lg bg-white text-black">
      <div className="flex flex-row min-h-[200px]">
        <div className="flex-1 min-h-[200px] pl-5">
          <div
            className="w-[300px] h-[300px] object-cover rounded-lg border border-blue-500 cursor-pointer"
            onClick={handleImageClick}
          >
            {selectedImage ? (
              <img
                src={selectedImage.img}
                alt="Shop"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-[80%] h-[80%] flex items-center justify-center">
                <PhotoIcon className="w-20 h-20 text-blue-500" />
              </div>
            )}
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
            className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 focus:outline-none focus:shadow-outline"
          >
            Upload Image
          </button>
        </div>
        <div className="flex-1 p-4">
          <h2 className="text-xl font-bold mb-4">Shop Information</h2>
          <form>
            <div className="mb-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newShop.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div className="mb-4">
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                  Phone:
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={newShop.phone}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <button
              onClick={handleChangeShop}
              type="button"
              className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </form>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default InfoCard;