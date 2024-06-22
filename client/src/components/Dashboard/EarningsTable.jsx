import React, { useState } from 'react';
import EarningsBarChart from './charts/EarningsBarChart';
import QuantityAreaChart from './charts/QuantityAreaChart';
import OrdersPieChart from './charts/OrdersPieChart';

const EarningsTable = ({ filteredItemTotals, shopName, filterPeriod }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const earningsData = Object.keys(filteredItemTotals).map(itemId => ({
    id: itemId,
    name: filteredItemTotals[itemId].name,
    total: filteredItemTotals[itemId].total,
    quantity: filteredItemTotals[itemId].quantity,
    ordersCount: filteredItemTotals[itemId].ordersCount
  }));

  const filteredData = earningsData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Total Earnings of Items for {shopName} ({filterPeriod})</h2>
      
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          placeholder="Search for items..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg mt-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Item ID</th>
              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Item Name</th>
              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Total Price</th>
              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Quantity Sold</th>
              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Orders with Item</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="py-1 px-2 border-b">{item.id}</td>
                <td className="py-1 px-2 border-b">{item.name}</td>
                <td className="py-1 px-2 border-b">${item.total.toFixed(2)}</td>
                <td className="py-1 px-2 border-b">{item.quantity}</td>
                <td className="py-1 px-2 border-b">{item.ordersCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={handlePreviousPage} 
          disabled={currentPage === 1} 
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages} 
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      
    </div>
  );
};

export default EarningsTable;
