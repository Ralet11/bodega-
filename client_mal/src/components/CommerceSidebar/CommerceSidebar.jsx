import React from 'react';
import { useState } from 'react';
import CategoriesFilter from './CategoriesFilter';
import PriceFilter from './PriceFilter';
import SearchBarCommerce from '../SearchBarCommerce/SearchBarCommerce';
import OrderFilter from './OrderFilter';

const CommerceSidebar = () => {
  return (
    <div className='bg-white border-l rounded-lg '>
      <div className="flex flex-col"> {/* Contenedor principal con display flex y flex-direction column */}
        <SearchBarCommerce className="" />
        
      </div>
    </div>
  );
};

export default CommerceSidebar;
