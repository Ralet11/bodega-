import React, { useState, useEffect } from 'react';
import ShopTable from './ShopTable';
import EarningsTable from './EarningsTable';
import OrdersTable from './OrdersTable';
import OrderDetailsModal from './OrderDetailsModal';
import FilterButtons from './FilterButtons';
import SalesLineChart from './charts/SalesLineChart';
import SalesScatterChart from './charts/SalesScatterChart';
import OrdersBarChart from './charts/OrdersBarChart';
import SalesPieChart from './charts/SalesPieChart';
import ContributionAreaChart from './charts/ContributionAreaChart';
import { formatCurrency, formatQuantity } from './utils'; // Asegúrate de que la ruta sea correcta

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

      // Calculate sales and contribution for filtered orders
      const sales = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
      const quantity = filteredOrders.reduce((sum, order) => {
        return sum + order.order_details.details.reduce((qSum, item) => qSum + item.quantity, 0);
      }, 0);
      const ordersCount = filteredOrders.length;

      newFilteredData[shopId] = { sales, quantity, ordersCount, orders: filteredOrders };
    });

    setFilteredOrdersData(newFilteredData);

    if (selectedShop) {
      filterItemTotals(newFilteredData[selectedShop]);
    }
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
  const totalQuantity = Object.values(filteredOrdersData).reduce((sum, shop) => sum + shop.quantity, 0);

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

  // Datos para el gráfico de líneas (ejemplo)
  const salesLineData = Object.keys(filteredOrdersData).flatMap(shopId => {
    return filteredOrdersData[shopId].orders.map(order => ({
      date: order.date_time.split('T')[0], // Extrayendo solo la fecha
      sales: parseFloat(order.total_price), // Precio total del pedido
      quantity: order.order_details.details.reduce((sum, item) => sum + item.quantity, 0), // Cantidad total de items en el pedido
    }));
  });

  // Datos para el gráfico de dispersión (ejemplo)
  const salesScatterData = Object.keys(filteredOrdersData).flatMap(shopId => {
    return filteredOrdersData[shopId].orders.flatMap(order => {
      return order.order_details.details.map(item => ({
        price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")), // Precio del producto
        quantity: item.quantity, // Cantidad vendida
      }));
    });
  });

  // Calcular el total de ventas y cantidades
  const totalSalesAmount = salesLineData.reduce((acc, data) => acc + data.sales, 0);
  const totalSalesQuantity = salesLineData.reduce((acc, data) => acc + data.quantity, 0);

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
          <OrdersBarChart data={ordersListData} />
        </div>
        <div className="w-full md:w-1/3 px-2">
          <ContributionAreaChart data={contributionData} />
        </div>
        <div className="w-full md:w-1/3 px-2">
          <SalesPieChart data={pieChartData} />
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2">
          <h2 className="text-xl font-bold mb-4">Sales Trend (Total Sales: {formatCurrency(totalSalesAmount)}, Total Quantity: {formatQuantity(totalSalesQuantity)})</h2>
          <SalesLineChart data={salesLineData} totalSalesAmount={totalSalesAmount} />
        </div>
        <div className="w-full md:w-1/2 px-2">
          <h2 className="text-xl font-bold mb-4">Sales vs Quantity</h2>
          <SalesScatterChart data={salesScatterData} />
        </div>
      </div>
      
      <FilterButtons filterOrders={filterOrders} showAllOrders={showAllOrders} />
      {selectedShop && (
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

      <OrderDetailsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedOrderDetails={selectedOrderDetails}
      />
    </div>
  );
};

export default ShopsComponent;
