import React, { useState, useEffect } from 'react';
import Input from '../../ui_bodega/Input';

const SearchBarCommerce = ({ setFilters, filters, className }) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, [searchTerm, setFilters]);

  return (
    <div className={`flex flex-col md:flex-row justify-evenly items-center w-full bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className='flex-grow p-2'>
        <Input
          placeholder="Search product..."
          type="text"
          name="title"
          value={searchTerm}
          onChange={handleChange}
          className="w-full p-4 border-0 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-lg transition duration-300 ease-in-out"
        />
      </div>
      <div className='mt-4 md:mt-0 md:ml-4'>
        <button 
          className="w-full md:w-auto bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-600 rounded-lg py-2 px-4"
          type="button"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBarCommerce;
