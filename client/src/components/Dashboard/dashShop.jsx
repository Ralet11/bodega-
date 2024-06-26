import React, { useState, useEffect } from 'react';
import EarningsTable from './EarningsTable';
import OrdersTable from './OrdersTable';
import OrderDetailsModal from './OrderDetailsModal';
import FilterButtons from './FilterButtons';
import EarningsBarChart from './charts/EarningsBarChart';
import QuantityAreaChart from './charts/QuantityAreaChart';
import OrdersPieChart from './charts/OrdersPieChart';
import HistoricalDataSection from './Sections/HistoricalDataSection';
import ShopSelectorSection from './Sections/ShopSelectorSection';
import { formatCurrency, formatQuantity } from './utils'; // Asegúrate de que la ruta sea correcta
import ShopIndicators from './Indicators/ShopIndicators';

const ShopsComponent = ({ shops, ordersData }) => {
  const [selectedShop, setSelectedShop] = useState(null);
  const [filteredOrdersData, setFilteredOrdersData] = useState(ordersData);
  const [filteredOrdersDataForCharts, setFilteredOrdersDataForCharts] = useState(ordersData);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredItemTotals, setFilteredItemTotals] = useState({});
  const [filterPeriod, setFilterPeriod] = useState('Historical Data');

  const filterOrders = (period) => {
    setFilterPeriod(period);
    const now = new Date();
    const newFilteredData = {};

    Object.keys(ordersData).forEach(shopId => {
      const filteredOrders = ordersData[shopId].orders.filter(order => {
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

      const sales = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
      const quantity = filteredOrders.reduce((sum, order) => sum + order.order_details.reduce((qSum, item) => qSum + item.quantity, 0), 0);
      const ordersCount = filteredOrders.length;

      newFilteredData[shopId] = { sales, quantity, ordersCount, orders: filteredOrders };
    });

    setFilteredOrdersDataForCharts(newFilteredData);
    updateFilteredItemTotals(newFilteredData);
    setFilteredOrdersData(newFilteredData);
  };

  const updateFilteredItemTotals = (data) => {
    if (selectedShop && selectedShop !== 'all') {
      filterItemTotals(data[selectedShop]);
    } else {
      const allFilteredOrders = Object.values(data).flatMap(shopData => shopData.orders);
      const newFilteredItemTotals = {};
      allFilteredOrders.forEach(order => {
        order.order_details.forEach(item => {
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
    }
  };

  const filterItemTotals = (filteredShopData) => {
    const newFilteredItemTotals = {};
    const orders = filteredShopData.orders || [];
    orders.forEach(order => {
      order.order_details.forEach(item => {
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
    setFilteredOrdersDataForCharts(ordersData);
    setFilteredOrdersData(ordersData);
    updateFilteredItemTotals(ordersData);
  };

  const selectShop = (shopId) => {
    setSelectedShop(shopId);
    if (filterPeriod !== 'Historical Data') {
      filterOrders(filterPeriod);
    } else {
      showAllOrders();
    }
  };

  const handleSeeDetails = (orderDetails, orderId) => {
    if (orderDetails && Array.isArray(orderDetails)) {
      const detailsWithOrderId = orderDetails.map(detail => ({ ...detail, orderId }));
      setSelectedOrderDetails(detailsWithOrderId);
      setIsModalOpen(true);
    } else {
      setSelectedOrderDetails([]);
    }
  };

  useEffect(() => {
    setFilteredOrdersData(ordersData);
    setFilteredOrdersDataForCharts(ordersData);
  }, [ordersData]);

  useEffect(() => {
    if (selectedShop) {
      if (selectedShop === 'all') {
        const allOrdersData = Object.values(ordersData).reduce((acc, shopData) => {
          return {
            sales: acc.sales + shopData.sales,
            quantity: acc.quantity + shopData.quantity,
            ordersCount: acc.ordersCount + shopData.ordersCount,
            orders: [...acc.orders, ...shopData.orders]
          };
        }, { sales: 0, quantity: 0, ordersCount: 0, orders: [] });

        setFilteredOrdersData({ all: allOrdersData });
        filterItemTotals(allOrdersData);
      } else {
        const newFilteredData = {
          [selectedShop]: ordersData[selectedShop]
        };
        setFilteredOrdersData(newFilteredData);
        filterItemTotals(ordersData[selectedShop]);
      }
    } else {
      setFilteredOrdersData(ordersData);
    }
  }, [selectedShop, ordersData]);

  const totalSales = Object.values(filteredOrdersDataForCharts).reduce((sum, shop) => sum + shop.sales, 0);
  const totalQuantity = Object.values(filteredOrdersDataForCharts).reduce((sum, shop) => sum + shop.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <ShopIndicators ordersData={filteredOrdersData} filterPeriod={filterPeriod} filterOrders={filterOrders} />
      <HistoricalDataSection ordersData={ordersData} />
      <ShopSelectorSection shops={shops} onSelectShop={selectShop} />

      {selectedShop && (
        <>
          <div className="mt-4 flex flex-wrap -mx-2">
            <div className="w-full md:w-1/3 px-2">
              <h2 className="text-xl font-bold mb-4">Earnings by Item</h2>
              <EarningsBarChart data={Object.values(filteredItemTotals)} />
            </div>
            <div className="w-full md:w-1/3 px-2">
              <h2 className="text-xl font-bold mb-4">Total Quantity by Item</h2>
              <QuantityAreaChart data={Object.values(filteredItemTotals)} />
            </div>
            <div className="w-full md:w-1/3 px-2">
              <h2 className="text-xl font-bold mb-4">Orders by Item</h2>
              <OrdersPieChart data={Object.values(filteredItemTotals)} />
            </div>
          </div>

          <FilterButtons filterOrders={filterOrders} showAllOrders={showAllOrders} />
          {selectedShop !== 'all' && (
            <>
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
