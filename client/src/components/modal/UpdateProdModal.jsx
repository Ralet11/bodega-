import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PlusIcon,
  InformationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { getParamsEnv } from '../../functions/getParamsEnv';

const colors = {
  primary: '#FFB74D',
  textPrimary: '#000000',
  textSecondary: '#FFFFFF',
  highlight: '#FFA726',
  border: '#BDBDBD',
  purple: '#BA68C8',
};

const { API_URL_BASE } = getParamsEnv();

export default function EditProductModal({
  show,
  handleClose,
  handleUpdate,
  selectedProduct,
  activeShop,
  clientId,
}) {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    originalPrice: '',
    discountPercentage: '',
    priceToSell: '',
    image: null,
    limitDate: '',
    modifiers: [],
    delivery: '0',
    promotionEnabled: false,
    promotionQuantity: '',
  });

  // Nuevo estado para el loader
  const [isSaving, setIsSaving] = useState(false);

  const token = useSelector((state) => state?.client?.token);

  useEffect(() => {
    if (selectedProduct) {

      setProduct({
        name: selectedProduct.name || '',
        description: selectedProduct.description || '',
        originalPrice:
          (
            parseFloat(selectedProduct.price) /
            (1 - (selectedProduct.discounts?.[0]?.percentage || 0) / 100)
          )?.toFixed(2) || '',
        discountPercentage:
          selectedProduct.discounts?.[0]?.percentage?.toString() || '',
        priceToSell: selectedProduct.price?.toString() || '',
        image: null,
        limitDate: selectedProduct.discounts?.[0]?.limitDate || '',
        modifiers:
          selectedProduct.extras?.map((extra) => ({
            id: extra.id,
            name: extra.name,
            required: extra.required,
            multipleSelect: !extra.onlyOne,
            options: extra.options.map((opt) => ({
              id: opt.id,
              name: opt.name,
              price: opt.price.toString(),
            })),
          })) || [],
        delivery: selectedProduct.discounts?.[0]?.delivery?.toString() || '0',
        promotionEnabled:
          selectedProduct.promotions && selectedProduct.promotions.length > 0
            ? true
            : false,
        promotionQuantity:
          selectedProduct.promotions && selectedProduct.promotions.length > 0
            ? selectedProduct.promotions[0].quantity.toString()
            : '',
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    const originalPrice = parseFloat(product.originalPrice) || 0;
    const discountPercentage = parseFloat(product.discountPercentage) || 0;
    const priceToSell = originalPrice * (1 - discountPercentage / 100);
    setProduct((prev) => ({
      ...prev,
      priceToSell: isNaN(priceToSell) ? '' : priceToSell.toFixed(2),
    }));
  }, [product.originalPrice, product.discountPercentage]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProduct((prev) => ({ ...prev, image: file }));
    }
  };

  const addModifier = () => {
    setProduct((prev) => ({
      ...prev,
      modifiers: [
        ...prev.modifiers,
        {
          id: null,
          name: '',
          required: false,
          multipleSelect: false,
          options: [],
        },
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
          ? {
              ...mod,
              options: [...mod.options, { id: null, name: '', price: '' }],
            }
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

  const handleSave = async () => {
    // Inicia el loader
    setIsSaving(true);

    try {
      const editedProduct = {
        name: product.name,
        description: product.description,
        originalPrice: product.originalPrice,
        discountPercentage: product.discountPercentage,
        priceToSell: product.priceToSell,
        image: product.image,
        limitDate: product.limitDate,
        modifiers: product.modifiers,
        delivery: product.delivery,
        promotionEnabled: product.promotionEnabled,
        promotionQuantity: product.promotionQuantity,
      };
      await handleUpdate(editedProduct);
    } catch (error) {
      console.error('Error updating the product:', error);
    } finally {
      // Finaliza el loader
      setIsSaving(false);
    }
  };

  if (!show) return null;

  return (
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
            Edit Product
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
          {/* Original Price and Discount Percentage */}
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
          {/* Price to Sell */}
          <div>
            <label
              htmlFor="priceToSell"
              className="block text-sm font-medium mb-1"
              style={{ color: colors.textPrimary }}
            >
              Price to Sell
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
                placeholder="Automatically calculated"
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
                ) : selectedProduct.img ? (
                  <img
                    src={selectedProduct.img}
                    alt="Product"
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
                  <p className="pl-1" style={{ color: colors.textPrimary }}>
                    or drag and drop
                  </p>
                </div>
                <p className="text-xs" style={{ color: colors.textPrimary }}>
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
              <option value="1">Takeaway</option>
              <option value="2">Both</option>
            </select>
          </div>
          {/* Promotion Section */}
          <div className="p-4 rounded-md border relative">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="promotionEnabled"
                name="promotionEnabled"
                checked={product.promotionEnabled}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-purple-600"
              />
              <label
                htmlFor="promotionEnabled"
                className="ml-2 font-medium flex items-center"
                style={{ color: colors.textPrimary }}
              >
                Enable Buy To Win Promotion
                <span className="ml-2 inline-block w-2 h-2 rounded-full bg-purple-600"></span>
              </label>
            </div>
            <InformationCircleIcon
              className="absolute top-4 right-4 h-6 w-6 cursor-pointer text-purple-600"
              title="When you enable this promotion, you set a required number of purchases that a user must make at your shop to redeem this product."
            />
            {product.promotionEnabled && (
              <div className="mt-2">
                <label
                  htmlFor="promotionQuantity"
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  Quantity of Purchases Required
                </label>
                <input
                  type="number"
                  id="promotionQuantity"
                  name="promotionQuantity"
                  value={product.promotionQuantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }}
                  min="1"
                  required
                />
              </div>
            )}
          </div>
          {/* Modifiers */}
          
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
            {isSaving ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  />
                </svg>
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
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
  );
}
