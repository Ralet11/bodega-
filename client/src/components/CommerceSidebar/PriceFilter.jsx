import React from 'react';
import { useState } from 'react';

const PriceFilter = (props) => {
    const [price, setPrice] = useState(50);

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };
    const { className, ...rest } = props; // Extraer className de las props
    return (
        <div className=" mb-4 px-6 py-1 border-r border-gray-200 flex-grow">
            <h3 className="text-lg font-semibold mb-1">Price Range</h3>
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
  );
};

export default PriceFilter;
