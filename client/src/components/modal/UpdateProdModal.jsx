import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

export default function EditProductModal({ show, handleClose, selectedProduct, handleUpdate, token, activeShop }) {
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
  });

  useEffect(() => {
    if (selectedProduct) {
      setProduct({
        ...selectedProduct,
        originalPrice: selectedProduct.price || '',
        modifiers: selectedProduct.extras || [],
      });
    }
  }, [selectedProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => {
      const updatedProduct = { ...prev, [name]: value };

      if (name === 'originalPrice' || name === 'discountPercentage') {
        const priceToSell = calculatePriceToSell(updatedProduct.originalPrice, updatedProduct.discountPercentage);
        updatedProduct.priceToSell = isNaN(priceToSell) ? '' : priceToSell.toFixed(2);
      }

      return updatedProduct;
    });
  };

  const calculatePriceToSell = (originalPrice, discountPercentage) => {
    const price = parseFloat(originalPrice) || 0;
    const discount = parseFloat(discountPercentage) || 0;
    return price * (1 - discount / 100);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({ ...prev, image: file }));
    }
  };

  const addModifier = () => {
    setProduct((prev) => ({
      ...prev,
      modifiers: [...prev.modifiers, { name: '', required: false, multipleSelect: false, options: [] }],
    }));
  };

  const updateModifier = (index, field, value) => {
    setProduct((prev) => ({
      ...prev,
      modifiers: prev.modifiers.map((mod, i) => i === index ? { ...mod, [field]: value } : mod),
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
        i === modifierIndex ? { ...mod, options: [...mod.options, { name: '', price: '' }] } : mod
      ),
    }));
  };

  const updateOption = (modifierIndex, optionIndex, field, value) => {
    setProduct((prev) => ({
      ...prev,
      modifiers: prev.modifiers.map((mod, i) =>
        i === modifierIndex ? {
          ...mod,
          options: mod.options.map((opt, j) => j === optionIndex ? { ...opt, [field]: value } : opt)
        } : mod
      ),
    }));
  };

  const removeOption = (modifierIndex, optionIndex) => {
    setProduct((prev) => ({
      ...prev,
      modifiers: prev.modifiers.map((mod, i) =>
        i === modifierIndex ? {
          ...mod,
          options: mod.options.filter((_, j) => j !== optionIndex)
        } : mod
      ),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // Implement your save logic here
    console.log('Saving product:', product);
    handleClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-4 flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">Edit Product</h2>
          <button onClick={handleClose} className="text-white hover:text-gray-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Original Price</label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={product.originalPrice}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">Discount %</label>
                <input
                  type="number"
                  id="discountPercentage"
                  name="discountPercentage"
                  value={product.discountPercentage}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="priceToSell" className="block text-sm font-medium text-gray-700">Selling Price</label>
                <input
                  type="text"
                  id="priceToSell"
                  name="priceToSell"
                  value={product.priceToSell}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                  disabled
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={product.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label htmlFor="delivery" className="block text-sm font-medium text-gray-700">Delivery Option</label>
              <select
                id="delivery"
                name="delivery"
                value={product.delivery}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="0">Dine-in</option>
                <option value="1">Pickup</option>
                <option value="2">Both</option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Modifiers</h3>
                <button
                  type="button"
                  onClick={addModifier}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Modifier
                </button>
              </div>
              {product.modifiers.map((modifier, modifierIndex) => (
                <div key={modifierIndex} className="border border-gray-200 rounded-md p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={modifier.name}
                      onChange={(e) => updateModifier(modifierIndex, 'name', e.target.value)}
                      placeholder="Modifier name"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeModifier(modifierIndex)}
                      className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={modifier.required}
                        onChange={(e) => updateModifier(modifierIndex, 'required', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Required</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={modifier.multipleSelect}
                        onChange={(e) => updateModifier(modifierIndex, 'multipleSelect', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Multiple Selection</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    {modifier.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => updateOption(modifierIndex, optionIndex, 'name', e.target.value)}
                          placeholder="Option name"
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          value={option.price}
                          onChange={(e) => updateOption(modifierIndex, optionIndex, 'price', e.target.value)}
                          placeholder="Price"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(modifierIndex, optionIndex)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(modifierIndex)}
                      className="mt-1 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Option
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}