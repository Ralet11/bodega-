import React, { useState } from 'react';

const CommerceSidebar = () => {
  const [price, setPrice] = useState(50);

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  return (
    <div className="fixed top-20 right-0 w-72 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
      {/* Header */}
      <div className="bg-gray-900 text-white py-4 px-6">
        <h2 className="text-xl font-semibold">Shop Filters</h2>
      </div>

      {/* Categories */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <label className="flex items-center mb-2">
          <input type="checkbox" className="mr-2" value="smokeShops" />
          <span>Smoke Shops</span>
        </label>
        <label className="flex items-center mb-2">
          <input type="checkbox" className="mr-2" value="drinks" />
          <span>Drinks</span>
        </label>
      </div>
      
      {/* Price Range */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <input 
          type="range" 
          className="w-full"
          min="0" 
          max="100" 
          value={price}
          onChange={handlePriceChange} 
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>$0</span>
          <span>${price}</span>
          <span>$100</span>
        </div>
      </div>
      
      {/* Product List */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Products</h3>
        <ul className="list-none p-0">
          <li className="mb-1">Product A (10 offers)</li>
          <li className="mb-1">Product B (5 offers)</li>
          <li className="mb-1">Product C (8 offers)</li>
          {/* Add more products here */}
        </ul>
      </div>
    </div>
  );
};

export default CommerceSidebar;