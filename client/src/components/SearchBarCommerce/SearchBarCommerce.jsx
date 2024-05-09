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
    <form onSubmit={handleSubmit} className={`relative flex items-center mt-[100px] w-2/3 ml-[200px]  ${className}`}>
      <Input
        placeholder="Search product..."
        type="text"
        name="title"
        onChange={handleChange}
        className='mb-4 border-l rounded-lg border-gray-200 shadow-lg'
      />
      
      <ButtonBodega className="ml-4 mb-4 font-bold text-1xl rounded-full text-yellow-600 bg-white hover:text-white hover:bg-yellow-600" type="submit">
        Search
      </ButtonBodega>
    </form>
  );
};

export default SearchBarCommerce;
