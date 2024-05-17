import React from 'react';

const CategoriesFilter = ({ setFilters, filters }) => {
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFilters(prev => {
      const categories = checked
        ? [...prev.categories, value]
        : prev.categories.filter(category => category !== value);
      return { ...prev, categories };
    });
  };

  return (
    <div className="mb-4 px-6 py-1 border-r border-gray-200 flex-grow">
      <h3 className="font-semibold mb-4 text-lg">Categories</h3>
      <div className="flex flex-col">
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            className="mr-2"
            value="1"
            checked={filters.categories.includes('1')}
            onChange={handleCategoryChange}
          />
          <span>Smoke Shops</span>
        </label>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            className="mr-2"
            value="2"
            checked={filters.categories.includes('2')}
            onChange={handleCategoryChange}
          />
          <span>Drinks</span>
        </label>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            className="mr-2"
            value="3"
            checked={filters.categories.includes('3')}
            onChange={handleCategoryChange}
          />
          <span>Weed</span>
        </label>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            className="mr-2"
            value="4"
            checked={filters.categories.includes('4')}
            onChange={handleCategoryChange}
          />
          <span>Accessories</span>
        </label>
      </div>
    </div>
  );
};

export default CategoriesFilter;
