import React from 'react';
import SearchBarCommerce from '../SearchBarCommerce/SearchBarCommerce';

const CommerceSidebar = ({ setFilters, filters }) => {
  return (
    <div className='bg-white border-l mt-20 rounded-lg p-4'>
      <SearchBarCommerce setFilters={setFilters} filters={filters} />
    </div>
  );
};

export default CommerceSidebar;
