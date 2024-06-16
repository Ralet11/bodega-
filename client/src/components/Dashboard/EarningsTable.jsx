import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

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

      {/* Gráficos */}
      <div className="mt-4 flex flex-wrap -mx-2">
        <div className="w-full md:w-1/3 px-2">
          <h2 className="text-xl font-bold mb-4">Earnings by Item</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/3 px-2">
          <h2 className="text-xl font-bold mb-4">Total Quantity by Item</h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="quantity" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/3 px-2">
          <h2 className="text-xl font-bold mb-4">Orders by Item</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={filteredData}
                dataKey="ordersCount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EarningsTable;
