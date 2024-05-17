import React from 'react';
import { useState } from 'react';

const PriceFilter = ({ setFilters, filters }) => {
    const handlePriceChange = (e) => {
        setFilters(prev => ({ ...prev, price: e.target.value }));
    };

    return (
        <div className=" mb-4 px-6 py-1 border-r border-gray-200 flex-grow">
            <h3 className="text-lg font-semibold mb-1">Price Range</h3>
            <input 
                type="range"
                className="w-full slider-yellow"
                min="0"
                max="100"
                value={filters.price}
                onChange={handlePriceChange} 
            />
            <div className="flex justify-between text-sm text-gray-600">
                <span>$0</span>
                <span>${filters.price}</span>
                <span>$100</span>
            </div>
        </div>
  );
};

export default PriceFilter;