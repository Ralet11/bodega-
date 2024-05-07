import React, { useState } from 'react';

const CommerceSidebar = () => {
  const [price, setPrice] = useState(50);

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  return (
    <div className="h-20 mt-5 bg-white w-2/3 m-auto border-l rounded-lg border-gray-200 shadow-lg overflow-y-auto flex flex-row">
      {/* Categories */}
      <div className="px-6 py-1 border-r border-gray-200 flex-grow">
        <h3 className=" font-semibold mb-4">Categories</h3>
        <label className=" items-center mb-2">
          <input type="checkbox" className="mr-2" value="smokeShops" />
          <span>Smoke Shops</span>
        </label>
        <label className="ml-3 mb-2">
          <input type="checkbox" className="mr-2" value="drinks" />
          <span>Drinks</span>
        </label>
      </div>
      
      {/* Price Range */}
      <div className="px-6 py-1 border-r border-gray-200 flex-grow">
  <h3 className="font-semibold mb-1">Price Range</h3>
  <input 
    type="range" 
    className="w-full slider-yellow" // Cambia bg-yellow-300 para el color amarillo deseado
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
      
    </div>
  );
};

export default CommerceSidebar;