import React, { useState } from 'react';

const OrdersTable = ({ filteredOrdersData, selectedShop, shops, filterPeriod, handleSeeDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const ordersPerPage = 10;

  const shopOrders = filteredOrdersData[selectedShop]?.orders || [];

  const filteredOrders = shopOrders.filter(order => 
    order.id.toString().includes(searchTerm) || 
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(order.date_time).toLocaleString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const displayedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

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
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Orders for {shops.find(shop => shop.id === selectedShop)?.name} ({filterPeriod})</h2>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          placeholder="Search for orders..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Order ID</th>
              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Date</th>
              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Total Price</th>
              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Status</th>
              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-1 px-2 border-b">{order.id}</td>
                  <td className="py-1 px-2 border-b">{new Date(order.date_time).toLocaleString()}</td>
                  <td className="py-1 px-2 border-b">{order.total_price}</td>
                  <td className="py-1 px-2 border-b">{order.status}</td>
                  <td className="py-1 px-2 border-b">
                    <button
                      onClick={() => handleSeeDetails(order.order_details, order.id)}
                      className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-green-600 transition-colors duration-200"
                    >
                      See Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b" colSpan="5">No orders found.</td>
              </tr>
            )}
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

export default OrdersTable;
