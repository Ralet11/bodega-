import React, { useState, useEffect } from 'react';
import EarningsTable from './EarningsTable';
import OrdersTable from './OrdersTable';
import OrderDetailsModal from './OrderDetailsModal';
import FilterButtons from './FilterButtons';
import SalesLineChart from './charts/SalesLineChart';
import SalesScatterChart from './charts/SalesScatterChart';
import OrdersBarChart from './charts/OrdersBarChart';
import SalesPieChart from './charts/SalesPieChart';
import ContributionAreaChart from './charts/ContributionAreaChart';
import EarningsBarChart from './charts/EarningsBarChart';
import QuantityAreaChart from './charts/QuantityAreaChart';
import OrdersPieChart from './charts/OrdersPieChart';
import { formatCurrency, formatQuantity } from './utils'; // Asegúrate de que la ruta sea correcta

const ShopsComponent = ({ shops, ordersData, selectedShop, selectedProduct }) => {
  const [filteredOrdersData, setFilteredOrdersData] = useState(ordersData);
  const [filteredOrdersDataForCharts, setFilteredOrdersDataForCharts] = useState(ordersData);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredItemTotals, setFilteredItemTotals] = useState({});
  const [filterPeriod, setFilterPeriod] = useState('Historical Data');
  const [currentPage, setCurrentPage] = useState(1);

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
      const quantity = filteredOrders.reduce((sum, order) => {
        return sum + order.order_details.reduce((qSum, item) => qSum + item.quantity, 0);
      }, 0);
      const ordersCount = filteredOrders.length;

      newFilteredData[shopId] = { sales, quantity, ordersCount, orders: filteredOrders };
    });

    setFilteredOrdersDataForCharts(newFilteredData);

    if (selectedShop && selectedShop !== 'all') {
      filterItemTotals(newFilteredData[selectedShop]);
    } else {
      const allFilteredOrders = Object.values(newFilteredData).flatMap(shopData => shopData.orders);
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
    setFilteredItemTotals({});
  };

  const selectShop = (shopId) => {
    setCurrentPage(1); // Reset current page to 1 when a new shop is selected
    if (filterPeriod !== 'Historical Data') {
      filterOrders(filterPeriod);
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

  useEffect(() => {
    if (selectedProduct) {
      const newFilteredData = {};
      Object.keys(ordersData).forEach(shopId => {
        const filteredOrders = ordersData[shopId].orders.filter(order => {
          return order.order_details.some(item => item.id === selectedProduct);
        });
        newFilteredData[shopId] = { orders: filteredOrders };
      });
      setFilteredOrdersData(newFilteredData);
    } else {
      setFilteredOrdersData(ordersData);
    }
  }, [selectedProduct, ordersData]);

  const totalSales = Object.values(filteredOrdersDataForCharts).reduce((sum, shop) => sum + shop.sales, 0);
  const totalQuantity = Object.values(filteredOrdersDataForCharts).reduce((sum, shop) => sum + shop.quantity, 0);

  const ordersListData = Object.keys(filteredOrdersDataForCharts).map(shopId => ({
    name: shops.find(shop => shop.id === parseInt(shopId))?.name || 'Unknown',
    ordersCount: filteredOrdersDataForCharts[shopId].ordersCount || 0
  }));

  const contributionData = Object.keys(filteredOrdersDataForCharts).map(shopId => ({
    name: shops.find(shop => shop.id === parseInt(shopId))?.name || 'Unknown',
    contribution: (filteredOrdersDataForCharts[shopId].sales / totalSales) * 100 || 0
  }));

  const pieChartData = Object.keys(filteredOrdersDataForCharts).map(shopId => ({
    name: shops.find(shop => shop.id === parseInt(shopId))?.name || 'Unknown',
    value: filteredOrdersDataForCharts[shopId].sales || 0
  }));

  const salesLineData = Object.keys(filteredOrdersData).flatMap(shopId => {
    return (filteredOrdersData[shopId]?.orders || []).map(order => ({
      date: order.date_time.split('T')[0],
      sales: parseFloat(order.total_price),
      quantity: order.order_details.reduce((sum, item) => sum + item.quantity, 0),
    }));
  });

  const salesScatterData = Object.keys(filteredOrdersData).flatMap(shopId => {
    return (filteredOrdersData[shopId]?.orders || []).flatMap(order => {
      return order.order_details.map(item => ({
        price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")),
        quantity: item.quantity,
      }));
    });
  });

  const totalSalesAmount = salesLineData.reduce((acc, data) => acc + data.sales, 0);
  const totalSalesQuantity = salesLineData.reduce((acc, data) => acc + data.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      {(selectedShop || selectedProduct) ? (
        <>
          <div className="mt-4 flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 lg:w-1/3 px-2">
              <OrdersBarChart data={Array.isArray(ordersListData) ? ordersListData : []} />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 px-2">
              <ContributionAreaChart data={Array.isArray(contributionData) ? contributionData : []} />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 px-2">
              <SalesPieChart data={Array.isArray(pieChartData) ? pieChartData : []} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2">
              <h2 className="text-xl font-bold mb-4">Sales Trend (Total Sales: {formatCurrency(totalSalesAmount)}, Total Quantity: {formatQuantity(totalSalesQuantity)})</h2>
              <SalesLineChart data={Array.isArray(salesLineData) ? salesLineData : []} totalSalesAmount={totalSalesAmount} totalSalesQuantity={totalSalesQuantity} />
            </div>
            <div className="w-full md:w-1/2 px-2">
              <h2 className="text-xl font-bold mb-4">Sales vs Quantity</h2>
              <SalesScatterChart data={Array.isArray(salesScatterData) ? salesScatterData : []} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap -mx-2">
            <div className="w-full md:w-1/3 px-2">
              <h2 className="text-xl font-bold mb-4">Earnings by Item</h2>
              <EarningsBarChart data={Array.isArray(Object.values(filteredItemTotals)) ? Object.values(filteredItemTotals) : []} />
            </div>
            <div className="w-full md:w-1/3 px-2">
              <h2 className="text-xl font-bold mb-4">Total Quantity by Item</h2>
              <QuantityAreaChart data={Array.isArray(Object.values(filteredItemTotals)) ? Object.values(filteredItemTotals) : []} />
            </div>
            <div className="w-full md:w-1/3 px-2">
              <h2 className="text-xl font-bold mb-4">Orders by Item</h2>
              <OrdersPieChart data={Array.isArray(Object.values(filteredItemTotals)) ? Object.values(filteredItemTotals) : []} />
            </div>
          </div>

          <FilterButtons filterOrders={filterOrders} showAllOrders={showAllOrders} />
          {selectedShop && selectedShop !== 'all' && (
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
      ) : (
        <div className="text-center text-xl font-bold mt-4">
          Please select a shop or product to see the data.
        </div>
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
