import React, { useState, useEffect } from 'react';
import Input from '../../ui_bodega/Input';
import { Bars3BottomRightIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const SearchBarCommerce = ({ setFilters, filters, className }) => {
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, [searchTerm, setFilters]);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 10,
      }}
      className={`hidden md:hidden flex flex-row mt-10 w-1/3 md:flex-row justify-evenly items-center bg-white rounded-lg shadow-lg p-4 ${className}`}
    >
      <div className='flex p-1'>
      <MagnifyingGlassCircleIcon className='w-8 h-8' />
        <Input
          placeholder="Search product..."
          type="text"
          name="title"
          value={searchTerm}
          onChange={handleChange}
          className="w-full p-1 border-0  rounded-lg transition duration-300 ease-in-out"
        />
        
      </div>
      
    </motion.div>
  );
};

export default SearchBarCommerce;
