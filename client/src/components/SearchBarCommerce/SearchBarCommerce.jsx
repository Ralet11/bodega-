import React, { useState, useEffect } from 'react';
import Input from '../../ui_bodega/Input';
import { Bars3BottomRightIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid'
const SearchBarCommerce = ({ setFilters, filters, className }) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, [searchTerm, setFilters]);

  return (
    <div className={`flex flex-row md:flex-row justify-evenly items-center w-full bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className='flex-grow p-1'>
        <Input
          placeholder="Search product..."
          type="text"
          name="title"
          value={searchTerm}
          onChange={handleChange}
          className="w-full p-1 border-0 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-lg transition duration-300 ease-in-out"
        />
      </div>
      <MagnifyingGlassCircleIcon className='w-8 h-8' />
    </div>
  );
};

export default SearchBarCommerce;
