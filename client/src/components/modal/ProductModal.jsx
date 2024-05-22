import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PhotoIcon } from '@heroicons/react/24/solid';
import axios from "axios";

export default function ProductModal({
  show,
  handleClose,
  handleSubmit,
  handleInputChange,
  newProduct,
  setNewProduct,
  selectedCategory,
}) {
  const [image, setImage] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      stock: 0,
      category_id: selectedCategory,
      img: null,
    });
  };

  async function convertBlobUrlToImageFile(blobUrl) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const filename = 'image.png';
    const type = 'image/png';
    return new File([blob], filename, { type });
  }

  const preHandleClose = () => {
    handleClose();
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      stock: 0,
      category_id: selectedCategory,
      img: null,
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const imageFile = await convertBlobUrlToImageFile(imageUrl);
      setNewProduct({
        ...newProduct,
        img: imageFile,
      });
      setImage(imageUrl);
    }
  };

  return (
    <div>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>

          <div className="bg-white w-full max-w-3xl mx-4 md:mx-auto rounded-lg shadow-lg relative">
            <div className="bg-blue-400 p-4 rounded-t-lg">
              <h2 className="text-xl font-semibold text-white">Add Product</h2>
            </div>
            <div className="p-4">
              <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <div className="mb-3">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <PhotoIcon className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-500">Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        name="img"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button className="bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-600 w-full" type="submit">
                    Save Product
                  </button>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
                  {image && (
                    <img
                      src={image}
                      alt={'Product Preview'}
                      className="w-full h-32 md:h-48 rounded-lg object-cover mb-4"
                    />
                  )}
                  <div className="text-center">
                    <div className="font-bold text-xl mb-2">{newProduct.name}</div>
                    <hr className="my-2 border-gray-300" />
                    <p className="text-gray-700 text-base font-serif italic">
                      {newProduct.description}
                    </p>
                    <hr className="my-2 border-gray-300" />
                    <p className="text-gray-700 text-base">Price: ${newProduct.price}</p>
                    <hr className="my-2 border-gray-300" />
                  </div>
                </div>
              </form>
            </div>
            <div className="bg-gray-100 px-6 py-4 flex justify-end rounded-b-lg">
              <button onClick={preHandleClose} className="text-blue-500 hover:underline cursor-pointer mr-4">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ProductModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  newProduct: PropTypes.object.isRequired,
  setNewProduct: PropTypes.func.isRequired,
  selectedCategory: PropTypes.number.isRequired,
};