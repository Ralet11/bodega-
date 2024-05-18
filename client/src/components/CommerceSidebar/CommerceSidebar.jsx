import React from 'react';
import SearchBarCommerce from '../SearchBarCommerce/SearchBarCommerce';

const CommerceSidebar = ({ setFilters, filters }) => {
  return (
    <div className='bg-white border-l mt-20 rounded-lg'>
      <div className="">
        <SearchBarCommerce setFilters={setFilters} filters={filters} />
      </div>
    </div>
  );
};

export default CommerceSidebar;
