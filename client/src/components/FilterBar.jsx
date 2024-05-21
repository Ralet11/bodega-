import React from 'react';
import OrderFilter from './CommerceSidebar/OrderFilter';
import PriceFilter from './CommerceSidebar/PriceFilter';
import CategoriesFilter from './CommerceSidebar/CategoriesFilter';

const FilterBar = ({ setFilters, filters }) => {
  return (
    <div className="w-full md:w-60 bg-white border rounded-lg border-gray-300 shadow-lg p-4 mr-4 max-w-xs">
      <h3 className="font-semibold text-yellow-600 text-lg mb-4 text-center">Filters</h3>
      <div className="mb-4">
        <OrderFilter setFilters={setFilters} filters={filters} />
      </div>
      <div className="mb-4">
        <PriceFilter setFilters={setFilters} filters={filters} />
      </div>
      <div>
        <CategoriesFilter setFilters={setFilters} filters={filters} />
      </div>
    
    </div>
  );
};

export default FilterBar;
