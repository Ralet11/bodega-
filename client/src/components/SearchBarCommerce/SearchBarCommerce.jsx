import React, { useState } from 'react';

const SearchBarCommerce = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center mt-[100px] w-2/3 ml-[200px]`}>
      <input 
        type="text" 
        className="w-full py-3 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 placeholder-gray-500 text-gray-800"
        placeholder="Search products..." 
        value={searchTerm} 
        onChange={handleChange} 
      />
      <button 
        type="submit" 
        className="absolute right-0 top-0 bg-[#F2BB26] text-black font-semibold py-3 px-6 rounded-r-md focus:outline-none focus:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBarCommerce;
