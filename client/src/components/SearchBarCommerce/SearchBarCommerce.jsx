import Input from '../../ui_bodega/Input';
import ButtonBodega from '../../ui_bodega/ButtonBodega';
import React, { useState } from 'react';

const SearchBarCommerce = ({ onSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center mt-20 w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      <Input
        placeholder="Search product..."
        type="text"
        name="title"
        onChange={handleChange}
        className='flex-1 p-4 border-0 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition duration-300 ease-in-out'
      />
      <button 
        className="p-4 bg-[#F2BB26] text-black font-bold hover:bg-yellow-700 transition duration-300 ease-in-out focus:outline-none"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBarCommerce;