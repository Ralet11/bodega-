// ProductModal.js

import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PlusIcon,
  InformationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';
import { getParamsEnv } from '../../functions/getParamsEnv';

// Updated colors
const colors = {
  primary: '#FFB74D', // Warm orange
  textPrimary: '#000000', // Black
  textSecondary: '#FFFFFF', // White
  highlight: '#FFA726', // Softer orange
  border: '#BDBDBD', // Neutral gray
};

const { API_URL_BASE } = getParamsEnv();

export default function ProductModal({
  show,
  handleClose,
  selectedCategory,
  setProducts,
  token,
  activeShop,
}) {
  const [product, setProduct] = useState({
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
      img: '',
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
        img: '',
        percentage: product.discountPercentage || '',
        fixedValue: '',
        order_details: { ...updatedProduct, id: productId },
        product_id: productId,
        category_id: selectedCategory,
        description: product.description,
        discountType: 'percentage',
        delivery: product.delivery,
        active: true,
        usageLimit: '',
        minPurchaseAmount: '',
        maxDiscountAmount: '',
        conditions: '',
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
            {/* Modal Header */}
            <div
              className="p-4 flex justify-between items-center"
              style={{ backgroundColor: colors.primary }}
            >
              <h2
                className="text-xl font-semibold"
                style={{ color: colors.textSecondary }}
              >
                Add New Product
              </h2>
              <button
                onClick={handleClose}
                className="hover:opacity-80"
                style={{ color: colors.textPrimary }}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {/* Modal Content */}
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
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                  placeholder="Product name"
                  required
                />
              </div>
              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={product.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none resize-none"
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                  placeholder="Describe your product..."
                  required
                ></textarea>
              </div>
              {/* Original Price and Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="originalPrice"
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.textPrimary }}
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
                      className="w-full px-3 py-2 border rounded-md focus:outline-none"
                      style={{
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                      placeholder="0.00"
                      required
                    />
                    <InformationCircleIcon
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
                      style={{ color: colors.highlight }}
                      title="Enter the original price before discount."
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="discountPercentage"
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.textPrimary }}
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
                      className="w-full px-3 py-2 border rounded-md focus:outline-none"
                      style={{
                        borderColor: colors.border,
                        color: colors.textPrimary,
                      }}
                      placeholder="0"
                      required
                    />
                    <InformationCircleIcon
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
                      style={{ color: colors.highlight }}
                      title="Enter the discount percentage."
                    />
                  </div>
                </div>
              </div>
              {/* Selling Price */}
              <div>
                <label
                  htmlFor="priceToSell"
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  Selling Price
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="priceToSell"
                    name="priceToSell"
                    value={product.priceToSell}
                    className="w-full px-3 py-2 bg-gray-100 border rounded-md focus:outline-none"
                    style={{
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                    placeholder="Calculated automatically"
                    disabled
                  />
                  <InformationCircleIcon
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
                    style={{ color: colors.highlight }}
                    title="This is the price after applying the discount."
                  />
                </div>
              </div>
              {/* Product Image */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  Product Image
                </label>
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md"
                  style={{ borderColor: colors.border }}
                >
                  <div className="space-y-1 text-center">
                    {product.image ? (
                      <img
                        src={URL.createObjectURL(product.image)}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-md"
                      />
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                        style={{ color: colors.border }}
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex text-sm">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium focus-within:outline-none"
                        style={{ color: colors.primary }}
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
                      <p
                        className="pl-1"
                        style={{ color: colors.textPrimary }}
                      >
                        or drag and drop
                      </p>
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: colors.textPrimary }}
                    >
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              {/* Expiration Date */}
              <div>
                <label
                  htmlFor="limitDate"
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  Expiration Date
                </label>
                <input
                  type="date"
                  id="limitDate"
                  name="limitDate"
                  value={product.limitDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                />
              </div>
              {/* Delivery Option */}
              <div>
                <label
                  htmlFor="delivery"
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  Delivery Option
                </label>
                <select
                  id="delivery"
                  name="delivery"
                  value={product.delivery}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                >
                  <option value="0">Dine-in</option>
                  <option value="1">Pickup</option>
                  <option value="2">Both</option>
                </select>
              </div>
              {/* Modifiers */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3
                    className="text-lg font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    Modifiers
                  </h3>
                  <button
                    type="button"
                    onClick={addModifier}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md hover:opacity-80 focus:outline-none"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.textSecondary,
                    }}
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Modifier
                  </button>
                </div>
                {product.modifiers.map((modifier, modifierIndex) => (
                  <div
                    key={modifierIndex}
                    className="border rounded-md p-4 space-y-4"
                    style={{ borderColor: colors.border }}
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={modifier.name}
                        onChange={(e) =>
                          updateModifier(modifierIndex, 'name', e.target.value)
                        }
                        className="flex-grow mr-2 px-3 py-2 border rounded-md focus:outline-none"
                        style={{
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        }}
                        placeholder="Modifier name"
                      />
                      <button
                        type="button"
                        onClick={() => removeModifier(modifierIndex)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full focus:outline-none"
                        style={{ color: colors.highlight }}
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
                          className="form-checkbox h-5 w-5"
                          style={{ color: colors.primary }}
                        />
                        <span
                          className="ml-2"
                          style={{ color: colors.textPrimary }}
                        >
                          Required
                        </span>
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
                          className="form-checkbox h-5 w-5"
                          style={{ color: colors.primary }}
                        />
                        <span
                          className="ml-2"
                          style={{ color: colors.textPrimary }}
                        >
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
                            className="flex-grow px-3 py-2 border rounded-md focus:outline-none"
                            style={{
                              borderColor: colors.border,
                              color: colors.textPrimary,
                            }}
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
                            className="w-24 px-3 py-2 border rounded-md focus:outline-none"
                            style={{
                              borderColor: colors.border,
                              color: colors.textPrimary,
                            }}
                            placeholder="Price"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeOption(modifierIndex, optionIndex)
                            }
                            className="inline-flex items-center p-2 border border-transparent rounded-full focus:outline-none"
                            style={{ color: colors.highlight }}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(modifierIndex)}
                        className="mt-2 inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md hover:bg-gray-50 focus:outline-none"
                        style={{
                          borderColor: colors.border,
                          color: colors.textPrimary,
                          backgroundColor: colors.textSecondary,
                        }}
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Option
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </form>
            {/* Modal Footer */}
            <div className="bg-gray-50 px-4 py-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium hover:opacity-80"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.textSecondary,
                }}
                onClick={handleSave}
              >
                Save Product
              </button>
              <button
                type="button"
                className="ml-3 inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-white text-base font-medium hover:bg-gray-50 focus:outline-none"
                style={{
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
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
