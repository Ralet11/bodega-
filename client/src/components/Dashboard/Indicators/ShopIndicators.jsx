'use client'

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  PencilIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import EarningsTable from '../EarningsTable';
import OrdersTable from '../OrdersTable';
import OrderDetailsModal from '../OrderDetailsModal';

export default function ShopIndicators({
  ordersData = {},
  filterPeriod = 'day',
  filterOrders = () => {},
  shops = [],
  filteredItemTotals = {}
}) {
  const [indicators, setIndicators] = useState([]);
  const activeShop = useSelector((state) => state.activeShop);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});

  const getCurrentDay = () => {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[new Date().getDay()];
  };

  const isShopOpen = (shop) => {
    const currentDay = getCurrentDay();
    const currentTime = new Date().toTimeString().split(' ')[0];
    const openHours = shop.openingHours?.find((hour) => hour.day === currentDay);

    if (openHours) {
      return currentTime >= openHours.open_hour && currentTime <= openHours.close_hour;
    }
    return false;
  };

  const handleEditClick = (shopId) => {
    navigate('/settings');
  };

  const handleSeeDetails = (orderDetails, orderId) => {
    let detailsWithOrderId = [];
    // Validamos que orderDetails sea un arreglo; si es string, intentamos parsearlo
    if (Array.isArray(orderDetails)) {
      detailsWithOrderId = orderDetails.map((detail) => ({ ...detail, orderId }));
    } else if (typeof orderDetails === 'string') {
      try {
        const parsed = JSON.parse(orderDetails);
        if (Array.isArray(parsed)) {
          detailsWithOrderId = parsed.map((detail) => ({ ...detail, orderId }));
        }
      } catch (error) {
        console.warn('orderDetails string no pudo ser parseado', error);
      }
    }
    setSelectedOrderDetails(detailsWithOrderId);
    setIsModalOpen(true);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Función para calcular los indicadores de cada tienda, validando siempre que order.order_details sea un arreglo
  const calculateIndicators = (data) => {
    return Object.keys(data).map((shopId) => {
      const shopData = data[shopId];
      const shopInfo = shops.find((shop) => shop.id === parseInt(shopId));

      const totalSales = shopData.orders.reduce(
        (sum, order) => sum + parseFloat(order.total_price || 0),
        0
      );

      const totalQuantity = shopData.orders.reduce((sum, order) => {
        // Comprobamos que order.order_details sea un arreglo. Si no lo es, usamos [] para evitar errores.
        const details = Array.isArray(order.order_details) ? order.order_details : [];
        return sum + details.reduce((qSum, item) => qSum + (item.quantity || 0), 0);
      }, 0);

      const totalOrders = shopData.orders.length;
      const avgSalesPerOrder = totalOrders ? totalSales / totalOrders : 0;

      // Calcular ventas por hora
      const hourlySales = {};
      shopData.orders.forEach((order) => {
        const orderTime = order.date_time ? new Date(order.date_time) : new Date();
        const hour = orderTime.getHours();
        hourlySales[hour] = (hourlySales[hour] || 0) + parseFloat(order.total_price || 0);
      });

      const hourlySalesData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        sales: hourlySales[i] || 0,
      }));

      // Calcular los productos más vendidos validando que order.order_details sea arreglo
      const itemSales = {};
      shopData.orders.forEach((order) => {
        const details = Array.isArray(order.order_details) ? order.order_details : [];
        details.forEach((item) => {
          if (!itemSales[item.name]) {
            itemSales[item.name] = 0;
          }
          itemSales[item.name] += item.quantity || 0;
        });
      });

      const topItemsData = Object.keys(itemSales)
        .map((name) => ({ name, quantity: itemSales[name] }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      return {
        shopId: String(shopId),
        shopName: shopInfo ? shopInfo.name : 'Unknown Shop',
        totalSales,
        totalQuantity,
        totalOrders,
        avgSalesPerOrder,
        isOpen: shopInfo ? isShopOpen(shopInfo) : false,
        hourlySalesData,
        topItemsData,
      };
    });
  };

  useEffect(() => {
    if (ordersData) {
      const newIndicators = calculateIndicators(ordersData);
      setIndicators(newIndicators);
    }
  }, [ordersData, filterPeriod, shops]);

  // Custom tooltip para los gráficos
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <p className="text-sm font-semibold text-gray-700">{`Hour: ${label}`}</p>
          <p className="text-sm text-gray-600">{`Sales: $${parseFloat(payload[0].value).toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col p-2 pb-20 sm:p-4 space-y-4 bg-white rounded-xl shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shop Performance</h2>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {['day', 'week', 'month', 'year', 'Historical Data'].map((period) => (
            <button
              key={period}
              onClick={() => filterOrders(period)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 flex-1 lg:flex-none ${
                filterPeriod === period
                  ? 'bg-gradient-to-r from-primary/80 to-primary text-primary-foreground shadow-sm'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {period === 'Historical Data'
                ? 'All Time'
                : `This ${period.charAt(0).toUpperCase() + period.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex flex-col gap-4 w-full">
          {indicators
            .filter((indicator) => parseInt(indicator.shopId) === parseInt(activeShop))
            .map((indicator, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 lg:p-6 w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <ShoppingBagIcon
                        className={`h-6 w-6 ${indicator.isOpen ? 'text-green-500' : 'text-red-500'}`}
                      />
                      <span
                        className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${
                          indicator.isOpen ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{indicator.shopName}</h3>
                      <span
                        className={`text-xs font-medium ${
                          indicator.isOpen ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {indicator.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>
                  {parseInt(indicator.shopId) === parseInt(activeShop) && (
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => handleEditClick(indicator.shopId)}
                    >
                      <PencilIcon className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-green-600">
                      <CurrencyDollarIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Total Sales</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-green-900 mt-2">
                      ${indicator.totalSales.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-600">
                      <ShoppingCartIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Total Quantity</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-blue-900 mt-2">
                      {indicator.totalQuantity}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-purple-600">
                      <ChartBarIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Total Orders</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-purple-900 mt-2">
                      {indicator.totalOrders}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-amber-600">
                      <ChartBarIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Avg Sales/Order</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-amber-900 mt-2">
                      ${indicator.avgSalesPerOrder.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl shadow-sm">
                    <button
                      className="w-full flex justify-between items-center p-4 text-left"
                      onClick={() => toggleSection('hourlySales')}
                    >
                      <h4 className="text-lg font-semibold text-gray-900">
                        Hourly Sales Distribution
                      </h4>
                      {expandedSections.hourlySales ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedSections.hourlySales && (
                      <div className="p-4 overflow-x-auto">
                        <div style={{ width: '100%', minWidth: '600px', height: '300px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={indicator.hourlySalesData}>
                              <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                              <XAxis
                                dataKey="hour"
                                tick={{ fill: '#6B7280' }}
                                axisLine={{ stroke: '#E5E7EB' }}
                                tickLine={{ stroke: '#E5E7EB' }}
                              />
                              <YAxis
                                tick={{ fill: '#6B7280' }}
                                axisLine={{ stroke: '#E5E7EB' }}
                                tickLine={{ stroke: '#E5E7EB' }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Area type="monotone" dataKey="sales" stroke="#4F46E5" fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-xl shadow-sm">
                    <button
                      className="w-full flex justify-between items-center p-4 text-left"
                      onClick={() => toggleSection('topProducts')}
                    >
                      <h4 className="text-lg font-semibold text-gray-900">
                        Top Selling Products
                      </h4>
                      {expandedSections.topProducts ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedSections.topProducts && (
                      <div className="p-4 overflow-x-auto">
                        <div style={{ width: '100%', minWidth: '600px', height: '300px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={indicator.topItemsData} layout="vertical">
                              <defs>
                                <linearGradient id="colorQuantity" x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.3} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                              <XAxis
                                type="number"
                                tick={{ fill: '#6B7280' }}
                                axisLine={{ stroke: '#E5E7EB' }}
                                tickLine={{ stroke: '#E5E7EB' }}
                              />
                              <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fill: '#6B7280' }}
                                axisLine={{ stroke: '#E5E7EB' }}
                                tickLine={{ stroke: '#E5E7EB' }}
                                width={150}
                              />
                              <Tooltip
                                formatter={(value) => `${value} units`}
                                contentStyle={{
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #E5E7EB',
                                  borderRadius: '0.5rem',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                              />
                              <Bar dataKey="quantity" fill="url(#colorQuantity)" barSize={20} radius={[0, 4, 4, 0]}>
                                {indicator.topItemsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={`rgba(79, 70, 229, ${1 - index * 0.15})`} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-xl shadow-sm">
                    <button
                      className="w-full flex justify-between items-center p-4 text-left"
                      onClick={() => toggleSection('earnings')}
                    >
                      <h4 className="text-lg font-semibold text-gray-900">Earnings</h4>
                      {expandedSections.earnings ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedSections.earnings && (
                      <div className="p-4">
                        <EarningsTable
                          filteredItemTotals={filteredItemTotals[indicator.shopId] || {}}
                          shopName={indicator.shopName}
                          filterPeriod={filterPeriod}
                        />
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-xl shadow-sm">
                    <button
                      className="w-full flex justify-between items-center p-4 text-left"
                      onClick={() => toggleSection('orders')}
                    >
                      <h4 className="text-lg font-semibold text-gray-900">Orders</h4>
                      {expandedSections.orders ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedSections.orders && (
                      <div className="p-4">
                        <OrdersTable
                          filteredOrdersData={{ [indicator.shopId]: ordersData[indicator.shopId] }}
                          selectedShop={indicator.shopId}
                          shops={shops}
                          filterPeriod={filterPeriod}
                          handleSeeDetails={handleSeeDetails}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <OrderDetailsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedOrderDetails={selectedOrderDetails}
      />
    </div>
  );
}
