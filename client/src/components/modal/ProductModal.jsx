import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PlusIcon,
  InformationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';
import { getParamsEnv } from '../../functions/getParamsEnv';
import toast from 'react-hot-toast';
import ToasterConfig from '../../ui_bodega/Toaster';

const colors = {
  primary: '#FFB74D', // Warm orange
  textPrimary: '#000000', // Black
  textSecondary: '#FFFFFF', // White
  highlight: '#FFA726', // Softer orange
  border: '#BDBDBD', // Neutral gray
};

const { API_URL_BASE } = getParamsEnv();

/**
 * Modal para CREAR productos (ProductModal).
 * Maneja:
 *   - AlwaysActive (descuento 24hs)
 *   - discountSchedule (array de franjas [{ start, end }, ...])
 */
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
    limitDate: '',
    preparationTime: '',
    modifiers: [],
    // Nuevo:
    AlwaysActive: false,
    discountSchedule: [],
  });

  const [isSaving, setIsSaving] = useState(false);

  // Set default expiration date to 5 years in the future if not set
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

  // Manejo de cambios en los campos
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'AlwaysActive') {
      // Marcar o desmarcar AlwaysActive
      setProduct((prev) => ({ ...prev, AlwaysActive: checked }));
    } else {
      // Otros campos
      setProduct((prev) => {
        const updated = { ...prev, [name]: value };
        // Recalcular priceToSell al cambiar originalPrice o discountPercentage
        if (name === 'originalPrice' || name === 'discountPercentage') {
          const originalPrice = parseFloat(updated.originalPrice) || 0;
          const discountPercent = parseFloat(updated.discountPercentage) || 0;
          const newPrice = originalPrice * (1 - discountPercent / 100);
          updated.priceToSell = isNaN(newPrice) ? '' : newPrice.toFixed(2);
        }
        return updated;
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProduct((prev) => ({ ...prev, image: file }));
    }
  };

  // --- Manejo de franjas horarias (discountSchedule) ---
  const addScheduleInterval = () => {
    setProduct((prev) => ({
      ...prev,
      discountSchedule: [...prev.discountSchedule, { start: '', end: '' }],
    }));
  };

  const updateScheduleInterval = (idx, field, val) => {
    setProduct((prev) => {
      const newSchedule = [...prev.discountSchedule];
      newSchedule[idx][field] = val;
      return { ...prev, discountSchedule: newSchedule };
    });
  };

  const removeScheduleInterval = (idx) => {
    setProduct((prev) => {
      const newSchedule = [...prev.discountSchedule];
      newSchedule.splice(idx, 1);
      return { ...prev, discountSchedule: newSchedule };
    });
  };

  // Validaciones
  const validateForm = () => {
    if (!product.name.trim()) {
      toast.error('Please enter the product name.');
      return false;
    }
    if (!product.description.trim()) {
      toast.error('Please enter the product description.');
      return false;
    }
    if (!product.originalPrice || parseFloat(product.originalPrice) <= 0) {
      toast.error('Please enter a valid original price.');
      return false;
    }
    if (!product.discountPercentage || parseFloat(product.discountPercentage) < 1) {
      toast.error('The minimum discount must be at least 1%.');
      return false;
    }
    if (!product.priceToSell) {
      toast.error('Unable to calculate the selling price. Check your data.');
      return false;
    }
    if (!product.image) {
      toast.error('Please select an image for the product.');
      return false;
    }
    if (!product.limitDate) {
      toast.error('Please select an expiration date.');
      return false;
    }
    if (!product.preparationTime) {
      toast.error('Please select the preparation time.');
      return false;
    }
    // Validar que si NO es AlwaysActive, exista al menos 1 franja
    if (!product.AlwaysActive && product.discountSchedule.length === 0) {
      toast.error('Add at least one schedule interval or mark "Always Active".');
      return false;
    }
    return true;
  };

  // Subir imagen al servidor
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
        if (response.status !== 200) {
          toast.error('Error uploading the image');
        }
      } catch (error) {
        toast.error('Error uploading image: ' + error);
        console.error('Image upload error:', error);
      }
    }
  };

  // Guardar producto
  const handleSave = async () => {
    if (!validateForm()) return;
    setIsSaving(true);

    const newProductPayload = {
      name: product.name,
      price: parseFloat(product.originalPrice), // precio base
      finalPrice: parseFloat(product.priceToSell),
      description: product.description,
      img: '',
      category_id: selectedCategory,
      discountPercentage: parseFloat(product.discountPercentage),
      preparationTime: parseInt(product.preparationTime, 10),
      // Campos para extras, si los manejas
      extras: product.modifiers.map((mod) => ({
        name: mod.name,
        required: mod.required,
        options: (mod.options || []).map((o) => ({
          name: o.name,
          price: parseFloat(o.price),
        })),
      })),
      // Nuevo
      AlwaysActive: product.AlwaysActive,
      discountSchedule: product.AlwaysActive ? null : product.discountSchedule,
    };

    try {
      const productResponse = await axios.post(
        `${API_URL_BASE}/api/products/add`,
        newProductPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (productResponse?.data?.id) {
        const newProductId = productResponse.data.id;
        // Subimos la imagen
        await handleImageUpload(newProductId, 'product');

        // Actualizamos la lista de productos
        const updatedRes = await axios.get(
          `${API_URL_BASE}/api/products/get/${selectedCategory}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(updatedRes.data);

        // Reseteamos campos
        setProduct({
          name: '',
          description: '',
          originalPrice: '',
          discountPercentage: '',
          priceToSell: '',
          image: null,
          limitDate: '',
          preparationTime: '',
          modifiers: [],
          AlwaysActive: false,
          discountSchedule: [],
        });

        toast.success('Product created successfully.');
        handleClose();
      } else {
        toast.error('Could not create the product (missing ID).');
      }
    } catch (error) {
      toast.error('Error saving the product: ' + error);
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Asegúrate de colocar <ToasterConfig /> en tu layout principal para que funcione toast */}
      <ToasterConfig />

      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
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

          {/* Body */}
          <form
            className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {/* Nombre, descripción, precio, discount, etc. */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                style={{ borderColor: colors.border, color: colors.textPrimary }}
                placeholder="Product name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={product.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none resize-none"
                style={{ borderColor: colors.border, color: colors.textPrimary }}
                placeholder="Describe your product..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
                  Original Price
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="originalPrice"
                    value={product.originalPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{ borderColor: colors.border, color: colors.textPrimary }}
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
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
                  Discount %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="discountPercentage"
                    value={product.discountPercentage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{ borderColor: colors.border, color: colors.textPrimary }}
                    placeholder="1"
                    min={1}
                    required
                  />
                  <InformationCircleIcon
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
                    style={{ color: colors.highlight }}
                    title="Enter the discount percentage (min 1%)."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
                Selling Price
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="priceToSell"
                  value={product.priceToSell}
                  className="w-full px-3 py-2 bg-gray-100 border rounded-md focus:outline-none"
                  style={{ borderColor: colors.border, color: colors.textPrimary }}
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

            {/* Imagen */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
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

            {/* Fecha de expiración */}
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

            {/* Tiempo de preparación */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
                Preparation Time (minutes)
              </label>
              <select
                name="preparationTime"
                value={product.preparationTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                style={{ borderColor: colors.border, color: colors.textPrimary }}
                required
              >
                <option value="">-- Select --</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="40">40</option>
              </select>
            </div>

            {/* Checkbox Always Active */}
            <div className="flex items-center space-x-2">
              <input
                id="AlwaysActive"
                name="AlwaysActive"
                type="checkbox"
                checked={product.AlwaysActive}
                onChange={handleInputChange}
              />
              <label
                htmlFor="AlwaysActive"
                className="text-sm font-medium"
                style={{ color: colors.textPrimary }}
              >
                Always Active (24 hs)
              </label>
            </div>

            {/* Schedule intervals si NO AlwaysActive */}
            {!product.AlwaysActive && (
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  Discount Schedule (Intervals)
                </label>
                {product.discountSchedule.map((interval, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="time"
                      value={interval.start}
                      onChange={(e) => updateScheduleInterval(idx, 'start', e.target.value)}
                      className="border px-2 py-1 rounded-md"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={interval.end}
                      onChange={(e) => updateScheduleInterval(idx, 'end', e.target.value)}
                      className="border px-2 py-1 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeScheduleInterval(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addScheduleInterval}
                  className="flex items-center space-x-2 px-2 py-1 text-sm font-medium rounded-md border bg-white hover:bg-gray-100"
                  style={{ borderColor: colors.border, color: colors.textPrimary }}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Interval</span>
                </button>
              </div>
            )}
          </form>

          {/* Footer */}
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
                'Save Product'
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
    </>
  );
}
