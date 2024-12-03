// OrderDetailsModal.js

import React from 'react';

const OrderDetailsModal = ({ isModalOpen, setIsModalOpen, selectedOrderDetails }) => {
  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <div className="overflow-y-auto max-h-96">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Item ID</th>
                <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Item Name</th>
                <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Price</th>
                <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrderDetails.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-1 px-2 border-b">{item.id}</td>
                  <td className="py-1 px-2 border-b">{item.name}</td>
                  <td className="py-1 px-2 border-b">{item.price}</td>
                  <td className="py-1 px-2 border-b">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => setIsModalOpen(false)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
