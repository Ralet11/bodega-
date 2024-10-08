import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PhotoIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { getParamsEnv } from "../../functions/getParamsEnv";
import { useSelector } from 'react-redux';
import axios from 'axios';

const { API_URL_BASE } = getParamsEnv();

export default function ProductModal({
  show,
  handleClose,
  selectedCategory,
  setProducts,
  setShowNewProductModal,
}) {
  const token = useSelector((state) => state?.client.token);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    stock: 0,
    category_id: selectedCategory,
    img: null,
  });
  const [image, setImage] = useState(null);
  const [extras, setExtras] = useState([]);
  const [errors, setErrors] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false); // State to manage tooltip visibility
  const [deleteExtraTooltip, setDeleteExtraTooltip] = useState(null); // Tooltip for delete extra
  const [deleteOptionTooltip, setDeleteOptionTooltip] = useState(null); // Tooltip for delete option

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct({
        ...newProduct,
        img: file,
      });
      setImage(imageUrl);
    }
  };

  const handleExtraChange = (index, field, value) => {
    const newExtras = [...extras];
    newExtras[index][field] = value;
    setExtras(newExtras);
  };

  const addExtra = () => {
    setExtras([...extras, { name: '', options: [{ name: '', price: 0 }], required: false }]);
    setErrors([...errors, { name: false, options: false }]);
  };

  const removeExtra = (index) => {
    const newExtras = extras.filter((_, reqIndex) => reqIndex !== index);
    setExtras(newExtras);
    const newErrors = errors.filter((_, errIndex) => errIndex !== index);
    setErrors(newErrors);
  };

  const handleOptionChange = (extraIndex, optionIndex, field, value) => {
    const newExtras = [...extras];
    newExtras[extraIndex].options[optionIndex][field] = value;
    setExtras(newExtras);
  };

  const addOption = (extraIndex) => {
    const newExtras = [...extras];
    newExtras[extraIndex].options.push({ name: '', price: 0 });
    setExtras(newExtras);
  };

  const removeOption = (extraIndex, optionIndex) => {
    const newExtras = [...extras];
    newExtras[extraIndex].options = newExtras[extraIndex].options.filter((_, index) => index !== optionIndex);
    setExtras(newExtras);
  };

  const handleImageUpload = async (productId) => {
    if (newProduct.img) {
      const formData = new FormData();
      formData.append('id', productId);
      formData.append('action', 'product');
      formData.append('img', newProduct.img);  // Cambiado a 'file'
  
      try {
        const response = await axios.post(`${API_URL_BASE}/api/up-image/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          console.log('Image uploaded successfully');
        } else {
          console.error('Error uploading image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    const newErrors = extras.map(extra => ({
      name: extra.name.trim() === '',
      options: !extra.options.some(option => option.name.trim() !== ''),
    }));

    setErrors(newErrors);

    const hasErrors = newErrors.some(error => error.name || error.options);
    if (hasErrors) {
      return;
    }

    const updatedNewProduct = {
      ...newProduct,
      category_id: selectedCategory,
      extras: extras,
    };

    try {
      const response = await axios.post(`${API_URL_BASE}/api/products/add`, updatedNewProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await handleImageUpload(response.data.id);

      const updatedProductsResponse = await axios.get(`${API_URL_BASE}/api/products/get/${selectedCategory}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(updatedProductsResponse.data);
      setShowNewProductModal(false);
      setNewProduct({
        name: '',
        price: 0,
        description: '',
        stock: 0,
        category_id: selectedCategory,
        img: null,
      });
      setExtras([]);
      setErrors([]);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

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
    setExtras([]);
    setErrors([]);
  };

  return (
    <div>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white w-full max-w-2xl mx-2 md:mx-auto rounded-lg shadow-lg relative max-h-screen overflow-auto">
            <div className="bg-blue-400 p-2 rounded-t-lg">
              <h2 className="text-sm font-semibold text-white">Add Product</h2>
            </div>
            <div className="p-2">
              <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2 rounded-lg shadow-md">
                  <h3 className="text-sm font-semibold mb-2">Product Details</h3>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-xs">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-xs">Price <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="price"
                      placeholder="Enter product price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-xs">Description</label>
                    <textarea
                      name="description"
                      placeholder="Enter product description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700 text-xs">Upload Image</label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <PhotoIcon className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-500 text-xs">Choose file</span>
                      <input
                        type="file"
                        accept="image/*"
                        name="img"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg shadow-md flex flex-col justify-center items-center">
                  {image && (
                    <img
                      src={image}
                      alt={'Product Preview'}
                      className="w-full h-16 md:h-20 rounded-lg object-cover mb-2"
                    />
                  )}
                  <div className="text-center">
                    <div className="font-bold text-xs mb-1">{newProduct.name}</div>
                    <hr className="my-1 border-gray-300" />
                    <p className="text-gray-700 text-xs font-serif italic">
                      {newProduct.description}
                    </p>
                    <hr className="my-1 border-gray-300" />
                    <p className="text-gray-700 text-xs">Price: ${newProduct.price}</p>
                    <hr className="my-1 border-gray-300" />
                  </div>
                </div>
              </form>
              <div className="p-2">
                <div className="flex items-center mb-2"> {/* Aligning info button next to Product Extras title */}
                  <h3 className="text-xs font-semibold">Product Extras</h3>
                  <div
                    className="relative ml-2"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <InformationCircleIcon className="h-5 w-5 text-blue-500 cursor-pointer" />
                    {showTooltip && (
                      <div className="absolute left-full top-0 ml-2 bg-gray-200 text-gray-700 text-xs p-2 rounded shadow-lg w-64 z-10">
                        To add extras:
                        <ul className="list-disc pl-4">
                          <li>Enter the extra name (e.g., "Select your flavor").</li>
                          <li>Check the box if this extra is required for the customer.</li>
                          <li>Add options for the extra, with their name and additional price.</li>
                          <li>You can add as many options as you need.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {extras.map((extra, extraIndex) => (
                  <div key={extraIndex} className="mb-2 border border-gray-200 rounded-lg p-2">
                    <div className="flex justify-between items-center mb-2 relative">
                      <input
                        type="text"
                        placeholder="Extra Name (e.g., Select Your Flavor)"
                        value={extra.name}
                        onChange={(e) => handleExtraChange(extraIndex, 'name', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded text-xs"
                      />
                      <button
                        type="button"
                        onMouseEnter={() => setDeleteExtraTooltip(extraIndex)}
                        onMouseLeave={() => setDeleteExtraTooltip(null)}
                        onClick={() => removeExtra(extraIndex)}
                        className="ml-1 text-red-500 hover:text-red-700 relative"
                      >
                        <TrashIcon className="h-4 w-4" />
                        {deleteExtraTooltip === extraIndex && (
                          <div className="absolute top-full mt-1 bg-gray-200 text-gray-700 text-xs p-1 rounded shadow-lg z-10">
                            Delete Extra
                          </div>
                        )}
                      </button>
                    </div>
                    {errors[extraIndex]?.name && (
                      <p className="text-red-500 text-xs">Extra name is required</p>
                    )}
                    <div className="mb-1">
                      <label className="flex items-center space-x-1 text-xs">
                        <input
                          type="checkbox"
                          checked={extra.required}
                          onChange={(e) => handleExtraChange(extraIndex, 'required', e.target.checked)}
                        />
                        <span className="text-gray-700">Required</span>
                      </label>
                    </div>
                    {extra.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center mb-1 space-x-2 relative">
                        <input
                          type="text"
                          placeholder="Option Name (e.g., Mango, Apple)"
                          value={option.name}
                          onChange={(e) => handleOptionChange(extraIndex, optionIndex, 'name', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded text-xs"
                        />
                        <label className="block text-gray-700 text-xs">Added price ($)</label>
                        <input
                          type="number"
                          placeholder="Price"
                          value={option.price}
                          onChange={(e) => handleOptionChange(extraIndex, optionIndex, 'price', e.target.value)}
                          className="w-20 p-1 border border-gray-300 rounded text-xs no-spin"
                          step="0.01"
                          min="0"
                        />
                        <button
                          type="button"
                          onMouseEnter={() => setDeleteOptionTooltip(optionIndex)}
                          onMouseLeave={() => setDeleteOptionTooltip(null)}
                          onClick={() => removeOption(extraIndex, optionIndex)}
                          className="ml-1 text-red-500 hover:text-red-700 relative"
                        >
                          <TrashIcon className="h-4 w-4" />
                          {deleteOptionTooltip === optionIndex && (
                            <div className="absolute top-full mt-1 bg-gray-200 text-gray-700 text-xs p-1 rounded shadow-lg z-10">
                              Delete Option
                            </div>
                          )}
                        </button>
                      </div>
                    ))}
                    {errors[extraIndex]?.options && (
                      <p className="text-red-500 text-xs">At least one valid option is required with a name and price greater than zero</p>
                    )}
                    <button
                      type="button"
                      onClick={() => addOption(extraIndex)}
                      className="bg-green-400 text-white py-1 px-2 rounded hover:bg-green-600 mt-1 text-xs"
                    >
                      Add Option
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExtra}
                  className="bg-blue-400 text-white py-1 px-2 rounded hover:bg-blue-600 text-xs"
                >
                  Add New Extra
                </button>
              </div>
              <div onClick={handleCreateProduct} className="bg-gray-100 px-3 py-2 flex justify-end rounded-b-lg">
                <button className="bg-blue-400 text-white py-1 px-2 rounded hover:bg-blue-600 w-full mt-2 text-xs" type="submit">
                    Save Product
                </button>
              </div>
            </div>
            <div className="bg-gray-100 px-3 py-2 flex justify-end rounded-b-lg">
              <button onClick={preHandleClose} className="text-blue-500 hover:underline cursor-pointer text-xs">
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
  selectedCategory: PropTypes.number.isRequired,
  setProducts: PropTypes.func.isRequired,
  setShowNewProductModal: PropTypes.func.isRequired,
};