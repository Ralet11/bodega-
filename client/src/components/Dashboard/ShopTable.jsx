import React from 'react';

const ShopTable = ({ shops, filteredOrdersData, totalSales, selectShop }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg mt-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">ID</th>
            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Name</th>
            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Address</th>
            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Image</th>
            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Status</th>
            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Phone</th>
            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Category</th>
            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Sales</th>
            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Contribution</th>
            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Orders</th>
            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Details</th>
          </tr>
        </thead>
        <tbody>
          {shops.length > 0 ? (
            shops.map((shop) => (
              <tr key={shop.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="py-1 px-2 border-b">{shop.id}</td>
                <td className="py-1 px-2 border-b">{shop.name}</td>
                <td className="py-1 px-2 border-b">{shop.address}</td>
                <td className="py-1 px-2 border-b">
                  <img src={shop.img} alt={shop.name} className="h-10 w-10 object-cover" />
                </td>
                <td className="py-1 px-2 border-b">{shop.status}</td>
                <td className="py-1 px-2 border-b">{shop.phone}</td>
                <td className="py-1 px-2 border-b">{shop.category}</td>
                <td className="py-1 px-2 border-b">{filteredOrdersData[shop.id]?.sales || 0}</td>
                <td className="py-1 px-2 border-b">{((filteredOrdersData[shop.id]?.sales / totalSales) * 100).toFixed(2) || 0}%</td>
                <td className="py-1 px-2 border-b">{filteredOrdersData[shop.id]?.ordersCount || 0}</td>
                <td className="py-1 px-2 border-b">
                  <button onClick={() => selectShop(shop.id)} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">See Details</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-2 px-4 border-b" colSpan="11">No shops found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShopTable;
