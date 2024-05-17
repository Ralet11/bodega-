import Input from '../../ui_bodega/Input';
import React, { useState, useEffect } from 'react';

const SearchBarCommerce = ({ setFilters, filters, className }) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, [searchTerm, setFilters]);

  return (
    <div className={`relative flex items-center w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      <Input
        placeholder="Search product..."
        type="text"
        name="title"
        value={searchTerm}
        onChange={handleChange}
        className='flex-1 p-4 border-0 focus:outline-none transition duration-300 ease-in-out'
      />
      <button 
        className="p-4 bg-[#F2BB26] text-black font-bold hover:bg-yellow-700 transition duration-300 ease-in-out focus:outline-none"
        type="button"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBarCommerce;
