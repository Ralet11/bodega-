import React from 'react';

const FilterButtons = ({ filterOrders, showAllOrders }) => {
  return (
    <div className="mt-4 flex space-x-2">
      <button onClick={() => filterOrders('day')} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">Day</button>
      <button onClick={() => filterOrders('month')} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">Month</button>
      <button onClick={() => filterOrders('trimester')} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">Trimester</button>
      <button onClick={() => filterOrders('semester')} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">Semester</button>
      <button onClick={() => filterOrders('year')} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">Year</button>
      <button onClick={showAllOrders} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">Historical Data</button>
    </div>
  );
};

export default FilterButtons;
