import React, { useState, useEffect } from 'react';
import ShopTable from './ShopTable';
import EarningsTable from './EarningsTable';
import OrdersTable from './OrdersTable';
import OrderDetailsModal from './OrderDetailsModal';
import FilterButtons from './FilterButtons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const ShopsComponent = ({ shops, ordersData }) => {
  const [filteredOrdersData, setFilteredOrdersData] = useState(ordersData);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [itemTotals, setItemTotals] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredItemTotals, setFilteredItemTotals] = useState({});
  const [filterPeriod, setFilterPeriod] = useState('Historical Data');
  const [currentPage, setCurrentPage] = useState(1);

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
          newFilteredItemTotals[item.id] = {
            name: item.name,
            total: 0,
            quantity: 0,
            ordersCount: 0
          };
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
    }
  };

  const selectShop = (shopId) => {
    setSelectedShop(shopId);
    setSelectedOrderDetails([]);
    setCurrentPage(1); // Reset current page to 1 when a new shop is selected
    filterOrders(filterPeriod); // Apply the current filter
  };

  const handleSeeDetails = (orderDetails, orderId) => {
    if (orderDetails && Array.isArray(orderDetails.details)) {
      const detailsWithOrderId = orderDetails.details.map(detail => ({ ...detail, orderId }));
      setSelectedOrderDetails(detailsWithOrderId);
      setIsModalOpen(true);
    } else {
      setSelectedOrderDetails([]);
    }
  };

  useEffect(() => {
    setFilteredOrdersData(ordersData);
  }, [ordersData]);

  const totalSales = Object.values(filteredOrdersData).reduce((sum, shop) => sum + shop.sales, 0);

  const ordersListData = Object.keys(filteredOrdersData).map(shopId => ({
    name: shops.find(shop => shop.id === parseInt(shopId))?.name || 'Unknown',
    ordersCount: filteredOrdersData[shopId].ordersCount
  }));

  const contributionData = Object.keys(filteredOrdersData).map(shopId => ({
    name: shops.find(shop => shop.id === parseInt(shopId))?.name || 'Unknown',
    contribution: (filteredOrdersData[shopId].sales / totalSales) * 100
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
      <ShopTable
        shops={shops}
        filteredOrdersData={filteredOrdersData}
        totalSales={totalSales}
        selectShop={selectShop}
      />

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
          <FilterButtons filterOrders={filterOrders} showAllOrders={showAllOrders} />
          <EarningsTable
            filteredItemTotals={filteredItemTotals}
            shopName={shops.find(shop => shop.id === selectedShop)?.name}
            filterPeriod={filterPeriod}
          />
          <OrdersTable
            filteredOrdersData={filteredOrdersData}
            selectedShop={selectedShop}
            shops={shops}
            filterPeriod={filterPeriod}
            handleSeeDetails={handleSeeDetails}
          />
        </>
      )}

      <OrderDetailsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedOrderDetails={selectedOrderDetails}
      />
    </div>
  );
};

export default ShopsComponent;
