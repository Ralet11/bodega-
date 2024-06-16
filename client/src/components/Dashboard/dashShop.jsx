import React, { useState, useEffect, Fragment } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Dialog, Transition } from '@headlessui/react';

const ShopsComponent = ({ shops, ordersData }) => {
  const [filteredOrdersData, setFilteredOrdersData] = useState(ordersData);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [itemTotals, setItemTotals] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredItemTotals, setFilteredItemTotals] = useState({});
  const [filterPeriod, setFilterPeriod] = useState('Historical Data');

  const filterOrders = (period) => {
    setFilterPeriod(period);

    if (!selectedShop) return;

    const now = new Date();
    const newFilteredData = { ...filteredOrdersData };
    const filteredOrders = ordersData[selectedShop].orders.filter(order => {
      const orderDate = new Date(order.date_time);
      switch (period) {
        case 'day':
          return orderDate.toDateString() === now.toDateString();
        case 'month':
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        case 'trimester':
          const currentQuarter = Math.floor((now.getMonth() + 3) / 3);
          const orderQuarter = Math.floor((orderDate.getMonth() + 3) / 3);
          return orderQuarter === currentQuarter && orderDate.getFullYear() === now.getFullYear();
        case 'semester':
          const currentSemester = now.getMonth() < 6 ? 1 : 2;
          const orderSemester = orderDate.getMonth() < 6 ? 1 : 2;
          return orderSemester === currentSemester && orderDate.getFullYear() === now.getFullYear();
        case 'year':
          return orderDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    // Calculate sales and contribution for filtered orders
    const sales = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
    const ordersCount = filteredOrders.length;

    newFilteredData[selectedShop] = { sales, ordersCount, orders: filteredOrders };

    setFilteredOrdersData(newFilteredData);
    filterItemTotals(newFilteredData[selectedShop]);
  };

  const filterItemTotals = (filteredShopData) => {
    const newFilteredItemTotals = {};
    const orders = filteredShopData.orders;
    orders.forEach(order => {
      order.order_details.details.forEach(item => {
        if (!newFilteredItemTotals[item.id]) {
          newFilteredItemTotals[item.id] = { name: item.name, total: 0, quantity: 0, ordersCount: 0 };
        }
        newFilteredItemTotals[item.id].total += parseFloat(item.price.replace(/[^0-9.-]+/g, "")) * item.quantity;
        newFilteredItemTotals[item.id].quantity += item.quantity;
        newFilteredItemTotals[item.id].ordersCount += 1;
      });
    });
    setFilteredItemTotals(newFilteredItemTotals);
  };

  const showAllOrders = () => {
    setFilterPeriod('Historical Data');
    setFilteredOrdersData(ordersData);
    if (selectedShop) {
      filterItemTotals(ordersData[selectedShop]);
    } else {
      setFilteredItemTotals(itemTotals);
    }
  };

  const selectShop = (shopId) => {
    setSelectedShop(shopId);
    setSelectedOrderDetails([]); // Reset order details when shop changes
    calculateItemTotals(shopId);
  };

  const handleSeeDetails = (orderDetails, orderId) => {
    if (orderDetails && Array.isArray(orderDetails.details)) {
      const detailsWithOrderId = orderDetails.details.map(detail => ({ ...detail, orderId }));
      setSelectedOrderDetails(detailsWithOrderId);
      setIsModalOpen(true); // Open the modal
    } else {
      setSelectedOrderDetails([]);
    }
  };

  const calculateItemTotals = (shopId) => {
    const totals = {};
    const shopOrders = ordersData[shopId]?.orders || [];
    shopOrders.forEach(order => {
      order.order_details.details.forEach(item => {
        if (!totals[item.id]) {
          totals[item.id] = { name: item.name, total: 0, quantity: 0, ordersCount: 0 };
        }
        totals[item.id].total += parseFloat(item.price.replace(/[^0-9.-]+/g, "")) * item.quantity;
        totals[item.id].quantity += item.quantity;
        totals[item.id].ordersCount += 1;
      });
    });
    setItemTotals(totals);
    setFilteredItemTotals(totals);
  };

  useEffect(() => {
    setFilteredOrdersData(ordersData);
    setFilteredItemTotals(itemTotals);
  }, [ordersData, itemTotals]);

  // Calculating total sales for all shops
  const totalSales = Object.values(filteredOrdersData).reduce((sum, shop) => sum + shop.sales, 0);

  // Preparing data for the charts
  const ordersListData = Object.keys(filteredOrdersData).map(shopId => ({
    name: shops.find(shop => shop.id === parseInt(shopId))?.name || 'Unknown',
    ordersCount: filteredOrdersData[shopId].ordersCount
  }));

  const contributionData = Object.keys(filteredOrdersData).map(shopId => ({
    name: shops.find(shop => shop.id === parseInt(shopId))?.name || 'Unknown',
    contribution: (filteredOrdersData[shopId].sales / totalSales) * 100 // Contribution as percentage
  }));

  const pieChartData = Object.keys(filteredOrdersData).map(shopId => ({
    name: shops.find(shop => shop.id === parseInt(shopId))?.name || 'Unknown',
    value: filteredOrdersData[shopId].sales
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Shops</h1>
      </div>
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

      <div className="mt-4 flex flex-wrap -mx-2">
        <div className="w-full md:w-1/3 px-2">
          <h2 className="text-xl font-bold mb-4">Orders by Shop</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={ordersListData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Legend />
              <Bar dataKey="ordersCount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/3 px-2">
          <h2 className="text-xl font-bold mb-4">Contribution to Total Sales</h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={contributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="contribution" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/3 px-2">
          <h2 className="text-xl font-bold mb-4">Sales by Shop</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {selectedShop && (
        <>
          <div className="mt-4 flex space-x-2">
            <button onClick={() => filterOrders('day')} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">Day</button>
            <button onClick={() => filterOrders('month')} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">Month</button>
            <button onClick={() => filterOrders('trimester')} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">Trimester</button>
            <button onClick={() => filterOrders('semester')} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">Semester</button>
            <button onClick={() => filterOrders('year')} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">Year</button>
            <button onClick={showAllOrders} className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200">Historical Data</button>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Total Earnings of Items for {shops.find(shop => shop.id === selectedShop)?.name} ({filterPeriod})</h2>
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
                  {Object.keys(filteredItemTotals).map(itemId => (
                    <tr key={itemId} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-1 px-2 border-b">{itemId}</td>
                      <td className="py-1 px-2 border-b">{filteredItemTotals[itemId].name}</td>
                      <td className="py-1 px-2 border-b">${filteredItemTotals[itemId].total.toFixed(2)}</td>
                      <td className="py-1 px-2 border-b">{filteredItemTotals[itemId].quantity}</td>
                      <td className="py-1 px-2 border-b">{filteredItemTotals[itemId].ordersCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Orders for {shops.find(shop => shop.id === selectedShop)?.name} ({filterPeriod})</h2>
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
                  {filteredOrdersData[selectedShop]?.orders.length > 0 ? (
                    filteredOrdersData[selectedShop].orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-1 px-2 border-b">{order.id}</td>
                        <td className="py-1 px-2 border-b">{new Date(order.date_time).toLocaleString()}</td>
                        <td className="py-1 px-2 border-b">{order.total_price}</td>
                        <td className="py-1 px-2 border-b">{order.status}</td>
                        <td className="py-1 px-2 border-b">
                          <button onClick={() => { handleSeeDetails(order.order_details, order.id); console.log(order.order_details); }} className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-green-600 transition-colors duration-200">See Details</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-2 px-4 border-b" colSpan="5">No orders found for this shop.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        Order Details
                      </Dialog.Title>
                      <div className="mt-2">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Order ID</th>
                              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Item ID</th>
                              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Product Name</th>
                              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Quantity</th>
                              <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrderDetails.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="py-1 px-2 border-b">{item.orderId}</td>
                                <td className="py-1 px-2 border-b">{item.id}</td>
                                <td className="py-1 px-2 border-b">{item.name}</td>
                                <td className="py-1 px-2 border-b">{item.quantity}</td>
                                <td className="py-1 px-2 border-b">{item.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default ShopsComponent;
