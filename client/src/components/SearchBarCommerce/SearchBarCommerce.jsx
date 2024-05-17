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
    <div className=" flex justify-evenly items-center w-full  bg-white rounded-lg shadow-lg">
      <div className='p-2 rounded-lg'>
        <Input
            
            placeholder="Search product..."
            type="text"
            name="title"
            value={searchTerm}
            onChange={handleChange}
            className="w-[900px] p-4 border-0 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:rounded-lg rounded-lg transition duration-300 ease-in-out"
          />
      </div>
        
      <div>
        <button 
          className="w-auto  bg-yellow-400 text-white font-bold hover:bg-yellow-500 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-600"
          type="button"
        >
          Search
        </button>
      </div>
      
    </div>
  );
};

export default SearchBarCommerce;
