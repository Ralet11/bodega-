import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PlusIcon,
  InformationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';
import { getParamsEnv } from '../../functions/getParamsEnv';

const { API_URL_BASE } = getParamsEnv();

export default function ProductModal({
  show,
  handleClose,
  selectedCategory,
  setProducts,
  token,
  activeShop, // Assuming you have activeShop passed as a prop
}) {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    originalPrice: '',
    discountPercentage: '',
    priceToSell: '',
    image: null,
    hasLimit: false,
    limitDate: '', // Added limitDate field
    hasExpiryDate: false,
    modifiers: [],
    delivery: '0', // Added delivery field (0 for dine-in by default)
  });

  // Set default limitDate to 5 years from now if not specified
  useEffect(() => {
    if (!product.limitDate) {
      const fiveYearsFromNow = new Date();
      fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
      setProduct((prev) => ({
        ...prev,
        limitDate: fiveYearsFromNow.toISOString().split('T')[0],
      }));
    }
  }, [product.limitDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => {
      const updatedProduct = { ...prev, [name]: value };

      if (name === 'originalPrice' || name === 'discountPercentage') {
        const originalPrice = parseFloat(updatedProduct.originalPrice) || 0;
        const discountPercentage =
          parseFloat(updatedProduct.discountPercentage) || 0;
        const priceToSell = originalPrice * (1 - discountPercentage / 100);
        updatedProduct.priceToSell = isNaN(priceToSell)
          ? ''
          : priceToSell.toFixed(2);
      }

      return updatedProduct;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProduct((prev) => ({ ...prev, image: file }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProduct((prev) => ({ ...prev, [name]: checked }));
  };

  const addModifier = () => {
    setProduct((prev) => ({
      ...prev,
      modifiers: [
        ...prev.modifiers,
        { name: '', required: false, multipleSelect: false, options: [] },
      ],
    }));
  };

  const updateModifier = (index, field, value) => {
    setProduct((prev) => ({
      ...prev,
      modifiers: prev.modifiers.map((mod, i) =>
        i === index ? { ...mod, [field]: value } : mod
      ),
    }));
  };

  const removeModifier = (index) => {
    setProduct((prev) => ({
      ...prev,
      modifiers: prev.modifiers.filter((_, i) => i !== index),
    }));
  };

  const addOption = (modifierIndex) => {
    setProduct((prev) => ({
      ...prev,
      modifiers: prev.modifiers.map((mod, i) =>
        i === modifierIndex
          ? { ...mod, options: [...mod.options, { name: '', price: '' }] }
          : mod
      ),
    }));
  };

  const updateOption = (modifierIndex, optionIndex, field, value) => {
    setProduct((prev) => ({
      ...prev,
      modifiers: prev.modifiers.map((mod, i) =>
        i === modifierIndex
          ? {
              ...mod,
              options: mod.options.map((opt, j) =>
                j === optionIndex ? { ...opt, [field]: value } : opt
              ),
            }
          : mod
      ),
    }));
  };

  const removeOption = (modifierIndex, optionIndex) => {
    setProduct((prev) => ({
      ...prev,
      modifiers: prev.modifiers.map((mod, i) =>
        i === modifierIndex
          ? {
              ...mod,
              options: mod.options.filter((_, j) => j !== optionIndex),
            }
          : mod
      ),
    }));
  };

  const handleImageUpload = async (id, action) => {
    if (product.image) {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('action', action);
      formData.append('img', product.image);

      try {
        const response = await axios.post(
          `${API_URL_BASE}/api/up-image/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

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

  const handleSave = async () => {
    // Prepare product data
    const updatedProduct = {
      name: product.name,
      price: parseFloat(product.priceToSell),
      description: product.description,
      img: '', // Placeholder; image is uploaded separately
      category_id: selectedCategory,
      extras: product.modifiers.map((modifier) => ({
        name: modifier.name,
        required: modifier.required,
        options: modifier.options.map((option) => ({
          name: option.name,
          price: parseFloat(option.price),
        })),
      })),
    };

    try {
      // Send product data to backend
      const productResponse = await axios.post(
        `${API_URL_BASE}/api/products/add`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const productId = productResponse.data.id;

      // Upload product image
      await handleImageUpload(productId, 'product');

      // Prepare discount data
      const discountData = {
        productName: product.name,
        local_id: activeShop,
        limitDate: product.limitDate,
        img: '', // Placeholder; image is uploaded separately
        percentage: product.discountPercentage || '',
        fixedValue: '', // Empty as per instructions
        order_details: { ...updatedProduct, id: productId }, // The whole product
        product_id: productId,
        category_id: selectedCategory,
        description: product.description,
        discountType: 'percentage',
        delivery: product.delivery,
        active: true,
        usageLimit: '', // Empty as per instructions
        minPurchaseAmount: '', // Empty as per instructions
        maxDiscountAmount: '', // Empty as per instructions
        conditions: '', // Empty as per instructions
      };

      // Send discount data to backend
      const discountResponse = await axios.post(
        `${API_URL_BASE}/api/discounts/add`,
        discountData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const discountId = discountResponse.data.newDiscount.id;

      // Upload discount image (same as product image)
      await handleImageUpload(discountId, 'discount');

      // Fetch updated products and update the state in parent component
      const updatedProductsResponse = await axios.get(
        `${API_URL_BASE}/api/products/get/${selectedCategory}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(updatedProductsResponse.data);

      // Reset form and close modal
      setProduct({
        name: '',
        description: '',
        originalPrice: '',
        discountPercentage: '',
        priceToSell: '',
        image: null,
        hasLimit: false,
        limitDate: '',
        hasExpiryDate: false,
        modifiers: [],
        delivery: '0',
      });

      handleClose();
    } catch (error) {
      console.error('Error saving the product and discount:', error);
    }
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center">
              <h2 className="text-white text-xl font-semibold">
                Add New Product
              </h2>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form
              className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {/* Product Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product name"
                  required
                />
              </div>
              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={product.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe your product..."
                  required
                ></textarea>
              </div>
              {/* Original Price and Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="originalPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Original Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="originalPrice"
                      name="originalPrice"
                      value={product.originalPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      required
                    />
                    <InformationCircleIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="discountPercentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Discount %
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="discountPercentage"
                      name="discountPercentage"
                      value={product.discountPercentage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      required
                    />
                    <InformationCircleIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              {/* Selling Price */}
              <div>
                <label
                  htmlFor="priceToSell"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Selling Price
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="priceToSell"
                    name="priceToSell"
                    value={product.priceToSell}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Calculated automatically"
                    disabled
                  />
                  <InformationCircleIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              {/* Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {product.image ? (
                      <img
                        src={URL.createObjectURL(product.image)}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-md"
                      />
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload an image</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              {/* Limit Date */}
              <div>
                <label
                  htmlFor="limitDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expiration Date
                </label>
                <input
                  type="date"
                  id="limitDate"
                  name="limitDate"
                  value={product.limitDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Delivery Option */}
              <div>
                <label
                  htmlFor="delivery"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Delivery Option
                </label>
                <select
                  id="delivery"
                  name="delivery"
                  value={product.delivery}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Dine-in</option>
                  <option value="1">Pickup</option>
                  <option value="2">Both</option>
                </select>
              </div>
              {/* Checkboxes */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasLimit"
                  name="hasLimit"
                  checked={product.hasLimit}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasLimit" className="text-sm text-gray-700">
                  Add Limit
                </label>
                <InformationCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasExpiryDate"
                  name="hasExpiryDate"
                  checked={product.hasExpiryDate}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasExpiryDate" className="text-sm text-gray-700">
                  Add Expiry Date
                </label>
                <InformationCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
              {/* Modifiers */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Modifiers
                  </h3>
                  <button
                    type="button"
                    onClick={addModifier}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Modifier
                  </button>
                </div>
                {product.modifiers.map((modifier, modifierIndex) => (
                  <div
                    key={modifierIndex}
                    className="border border-gray-200 rounded-md p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={modifier.name}
                        onChange={(e) =>
                          updateModifier(
                            modifierIndex,
                            'name',
                            e.target.value
                          )
                        }
                        className="flex-grow mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Modifier name"
                      />
                      <button
                        type="button"
                        onClick={() => removeModifier(modifierIndex)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={modifier.required}
                          onChange={(e) =>
                            updateModifier(
                              modifierIndex,
                              'required',
                              e.target.checked
                            )
                          }
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Required</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={modifier.multipleSelect}
                          onChange={(e) =>
                            updateModifier(
                              modifierIndex,
                              'multipleSelect',
                              e.target.checked
                            )
                          }
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">
                          Multiple Selection
                        </span>
                      </label>
                    </div>
                    {/* Options */}
                    <div className="space-y-2">
                      {modifier.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="text"
                            value={option.name}
                            onChange={(e) =>
                              updateOption(
                                modifierIndex,
                                optionIndex,
                                'name',
                                e.target.value
                              )
                            }
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Option name"
                          />
                          <input
                            type="number"
                            value={option.price}
                            onChange={(e) =>
                              updateOption(
                                modifierIndex,
                                optionIndex,
                                'price',
                                e.target.value
                              )
                            }
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Price"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeOption(modifierIndex, optionIndex)
                            }
                            className="inline-flex items-center p-2 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(modifierIndex)}
                        className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Option
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </form>
            <div className="bg-gray-50 px-4 py-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none"
                onClick={handleSave}
              >
                Save Product
              </button>
              <button
                type="button"
                className="ml-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
