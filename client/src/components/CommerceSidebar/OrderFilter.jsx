import React from 'react';

const OrderFilter = ({ setFilters, filters }) => {
  const handleOrderChange = (e) => {
    setFilters(prev => ({ ...prev, order: e.target.value }));
  };

  return (
    <div className="mb-4 px-6 py-1 border-r border-gray-200 flex-grow">
      <h3 className=" text-lg font-semibold mb-4">Order by</h3>
      <div className="flex flex-col">
        <label className="flex items-center mb-2">
          <input
            type="radio"
            className="mr-2"
            name="order"
            value="newest"
            checked={filters.order === 'newest'}
            onChange={handleOrderChange}
          />
          <span>Newest</span>
        </label>
        <label className="flex items-center mb-2">
          <input
            type="radio"
            className="mr-2"
            name="order"
            value="oldest"
            checked={filters.order === 'oldest'}
            onChange={handleOrderChange}
          />
          <span>Oldest</span>
        </label>
      </div>
    </div>
  );
};

export default OrderFilter;
