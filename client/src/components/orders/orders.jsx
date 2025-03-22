import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Utensils, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { getParamsEnv } from '../../functions/getParamsEnv';
import { useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';

const { API_URL_BASE } = getParamsEnv();

const statusColors = {
  'new order': 'bg-blue-500',
  accepted: 'bg-purple-500',
  sending: 'bg-green-500',
  finished: 'bg-gray-500',
  cancelled: 'bg-red-500',
};

export default function OrderDashboard() {
  const [orders, setOrders] = useState({ dineIn: [], pickup: [] });
  const [searchCode, setSearchCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('dineIn');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Aquí se mostrará la cantidad de órdenes que NO estén en finished
  const [newOrderCounts, setNewOrderCounts] = useState({ dineIn: 0, pickup: 0 });

  const activeShop = useSelector((state) => state.activeShop);
  const token = useSelector((state) => state?.client?.token);

  useEffect(() => {
    const dineInActiveOrders = orders.dineIn.filter(
      (order) => order.status.toLowerCase() !== 'finished'
    ).length;
    const pickupActiveOrders = orders.pickup.filter(
      (order) => order.status.toLowerCase() !== 'finished'
    ).length;
    setNewOrderCounts({ dineIn: dineInActiveOrders, pickup: pickupActiveOrders });
  }, [orders]);

  const fetchOrders = async () => {
    try {
      if (!token || !activeShop) {
        console.error('Token or active shop is missing');
        return;
      }
      const response = await axios.get(
        `${API_URL_BASE}/api/orders/getByLocalIdAndStatus/${activeShop}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedOrders = response.data;
      if (fetchedOrders && fetchedOrders.dineIn && fetchedOrders.pickup) {
        setOrders(fetchedOrders);
      } else {
        console.error('Unexpected response structure:', fetchedOrders);
        setOrders({ dineIn: [], pickup: [] });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders({ dineIn: [], pickup: [] });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeShop, token]);

  useEffect(() => {
    const socket = socketIOClient('http://localhost:80');
    const handleNewOrder = async (data) => {
      try {
        await fetchOrders();
        console.log('New order received and orders updated:', data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    socket.on('newOrder', handleNewOrder);
    return () => {
      socket.off('newOrder', handleNewOrder);
      socket.disconnect();
    };
  }, [token, activeShop]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      let endpoint = '';
      switch (newStatus.toLowerCase()) {
        case 'accepted':
          endpoint = `${API_URL_BASE}/api/orders/accept/${orderId}`;
          break;
        case 'sending':
          endpoint = `${API_URL_BASE}/api/orders/send/${orderId}`;
          break;
        case 'finished':
          endpoint = `${API_URL_BASE}/api/orders/finished/${orderId}`;
          break;
        case 'cancelled':
          endpoint = `${API_URL_BASE}/api/orders/cancel/${orderId}`;
          break;
        default:
          console.error(`Unknown status: ${newStatus}`);
          return;
      }
      await axios.put(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleSearch = () => {
    const allOrders = [...orders.dineIn, ...orders.pickup];
    const foundOrder = allOrders.find((order) => order.code === searchCode);
    if (foundOrder) {
      setSelectedOrder(foundOrder);
      setIsDialogOpen(true);
    } else {
      alert('Order not found. Please check the order code and try again.');
      setSelectedOrder(null);
    }
  };

  // Componente para cada tarjeta de orden
  const OrderCard = ({ order }) => {
    const [localUnlockInput, setLocalUnlockInput] = useState('');
    let displayStatus = order.status.charAt(0).toUpperCase() + order.status.slice(1);
    if (order.status.toLowerCase() === 'sending') {
      displayStatus = 'Ready';
    }

    return (
      <motion.div
        key={order.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <div className="bg-white rounded-lg shadow-md">
          <div className={`h-1 ${statusColors[order.status.toLowerCase()]}`} />
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                {order.type === 'Order-in' ? (
                  order.status.toLowerCase() === 'new order' ? (
                    // En dine‑in en "new order" no se muestra el código
                    null
                  ) : (
                    <span className="text-lg font-semibold text-gray-800">
                      #{order.code}
                    </span>
                  )
                ) : (
                  // Para pickup se muestra el id de la orden como número de orden
                  <span className="text-lg font-semibold text-gray-800">
                    #{order.id}
                  </span>
                )}
                {order.user && order.user.name && (
                  <p className="text-sm text-gray-500">Client: {order.user.name}</p>
                )}
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[order.status.toLowerCase()]}`}
              >
                {displayStatus}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3"></p>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsDialogOpen(true);
                  }}
                  className="text-xs px-3 py-1 border border-gray-300 hover:border-gray-400 rounded-md text-gray-700"
                >
                  Details
                </button>
                {order.type === 'Order-in' ? (
                  // Dine-in: new order => accepted => sending => finished
                  order.status.toLowerCase() === 'new order' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="6-digit code"
                        value={localUnlockInput}
                        onChange={(e) => setLocalUnlockInput(e.target.value)}
                        className="w-20 text-xs px-2 py-1 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={() => {
                          if (localUnlockInput === order.code) {
                            handleStatusChange(order.id, 'accepted');
                            setLocalUnlockInput('');
                          } else {
                            alert('Código incorrecto, por favor intenta de nuevo.');
                          }
                        }}
                        className="text-xs px-3 py-1 bg-[#F2BB26] hover:bg-[#E0A816] text-white rounded-md shadow"
                      >
                        Unlock
                      </button>
                    </div>
                  ) : order.status.toLowerCase() === 'accepted' ? (
                    <button
                      onClick={() => handleStatusChange(order.id, 'sending')}
                      className="text-xs px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md shadow"
                    >
                      Ready
                    </button>
                  ) : order.status.toLowerCase() === 'sending' ? (
                    <button
                      onClick={() => handleStatusChange(order.id, 'finished')}
                      className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
                    >
                      Complete
                    </button>
                  ) : null
                ) : (
                  // Pickup: new order => accepted => sending => finished
                  (() => {
                    const status = order.status.toLowerCase();
                    if (status === 'new order') {
                      return (
                        <button
                          onClick={() => handleStatusChange(order.id, 'accepted')}
                          className="text-xs px-3 py-1 bg-[#F2BB26] hover:bg-[#E0A816] text-white rounded-md shadow"
                        >
                          Accept
                        </button>
                      );
                    } else if (status === 'accepted') {
                      return (
                        <button
                          onClick={() => handleStatusChange(order.id, 'sending')}
                          className="text-xs px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md shadow"
                        >
                          Ready
                        </button>
                      );
                    } else if (status === 'sending') {
                      return (
                        <button
                          onClick={() => handleStatusChange(order.id, 'finished')}
                          className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
                        >
                          Complete
                        </button>
                      );
                    } else {
                      return null;
                    }
                  })()
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderOrderDetails = (orderDetails) => {
    if (!orderDetails || orderDetails.length === 0) {
      return <p className="text-gray-500">No details available for this order.</p>;
    }
    return (
      <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-4">
        {orderDetails.map((detail, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 shadow flex items-center space-x-4"
          >
            <img
              src={detail.img || '/placeholder.svg'}
              alt={detail.name}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-md text-gray-800">{detail.name}</h4>
                <p className="font-semibold text-md">${detail.price}</p>
              </div>
              <p className="text-sm text-gray-600">Quantity: {detail.quantity}</p>
              {detail.extras && detail.extras.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  <p className="font-semibold">Extras:</p>
                  <ul className="list-disc list-inside">
                    {detail.extras.map((extra, idx) => (
                      <li key={idx}>
                        {extra.name} - ${extra.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOrderSection = (title, ordersArr) => (
    <div className="flex-1 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold p-4 bg-gray-100">{title}</h3>
      {ordersArr.length === 0 ? (
        <p className="p-4 text-gray-500">No orders available.</p>
      ) : (
        <div className="h-[calc(100vh-16rem)] overflow-y-auto p-4 custom-scrollbar">
          <AnimatePresence>
            {ordersArr.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-3 lg:p-20 md:p-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 mt-10 md:mt-1 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="hidden md:block text-3xl font-bold text-gray-800 mb-4">
            Order Dashboard
          </h1>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Enter order code"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="mr-2 w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2BB26]"
            />
            <button
              onClick={handleSearch}
              className="bg-[#F2BB26] text-white hover:bg-[#E0A816] px-4 py-2 rounded-md shadow flex items-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('dineIn')}
              className={`flex items-center py-4 px-6 text-lg font-medium focus:outline-none ${
                activeTab === 'dineIn'
                  ? 'border-b-2 border-[#F2BB26] text-[#F2BB26]'
                  : 'text-gray-600 hover:text-[#F2BB26]'
              } relative`}
            >
              <Utensils className="mr-2 h-5 w-5" />
              Dine-in
              {newOrderCounts.dineIn > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {newOrderCounts.dineIn}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('pickup')}
              className={`flex items-center py-4 px-6 text-lg font-medium focus:outline-none ${
                activeTab === 'pickup'
                  ? 'border-b-2 border-[#F2BB26] text-[#F2BB26]'
                  : 'text-gray-600 hover:text-[#F2BB26]'
              } relative`}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Pickup
              {newOrderCounts.pickup > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {newOrderCounts.pickup}
                </span>
              )}
            </button>
          </div>

          <div className="p-4 md:p-6">
            {activeTab === 'dineIn' ? (
              // Dine-In con 4 columnas: New Orders, In Preparation, Ready, Finished
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                {renderOrderSection(
                  'New Orders',
                  orders.dineIn.filter(
                    (order) => order.status.toLowerCase() === 'new order'
                  )
                )}
                {renderOrderSection(
                  'In Preparation',
                  orders.dineIn.filter(
                    (order) => order.status.toLowerCase() === 'accepted'
                  )
                )}
                {renderOrderSection(
                  'Ready',
                  orders.dineIn.filter(
                    (order) => order.status.toLowerCase() === 'sending'
                  )
                )}
                {renderOrderSection(
                  'Finished',
                  orders.dineIn.filter(
                    (order) => order.status.toLowerCase() === 'finished'
                  )
                )}
              </div>
            ) : (
              // Pickup con 4 columnas: New Orders, Accepted, Ready for Pickup, Completed
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderOrderSection(
                  'New Orders',
                  orders.pickup.filter(
                    (order) => order.status.toLowerCase() === 'new order'
                  )
                )}
                {renderOrderSection(
                  'Accepted Orders',
                  orders.pickup.filter(
                    (order) => order.status.toLowerCase() === 'accepted'
                  )
                )}
                {renderOrderSection(
                  'Ready for Pickup',
                  orders.pickup.filter(
                    (order) => order.status.toLowerCase() === 'sending'
                  )
                )}
                {renderOrderSection(
                  'Completed Orders',
                  orders.pickup.filter(
                    (order) => order.status.toLowerCase() === 'finished'
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isDialogOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
              {selectedOrder.type === 'Order-in' ? (
                selectedOrder.status.toLowerCase() === 'new order' ? (
                  <h2 className="text-2xl font-semibold">Order Details - Dine-in Order</h2>
                ) : (
                  <h2 className="text-2xl font-semibold">Order Details - #{selectedOrder.code}</h2>
                )
              ) : (
                <h2 className="text-2xl font-semibold">Order Details - #{selectedOrder.id}</h2>
              )}
              {selectedOrder.user && selectedOrder.user.name && (
                <p className="text-sm text-gray-500 mt-1">Client: {selectedOrder.user.name}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Status:{' '}
                <span
                  className={`font-semibold ${statusColors[selectedOrder.status.toLowerCase()]} text-white px-2 py-1 rounded-full`}
                >
                  {selectedOrder.status?.toLowerCase() === 'sending'
                    ? 'Ready'
                    : selectedOrder.status?.charAt(0).toUpperCase() +
                      selectedOrder.status?.slice(1)}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Type:{' '}
                <span className="font-semibold">
                  {selectedOrder.type === 'Order-in' ? 'Dine-in' : 'Pickup'}
                </span>
              </p>
            </div>
            <div className="p-6">
              {selectedOrder.order_details ? (
                renderOrderDetails(selectedOrder.order_details)
              ) : (
                <p>No details available.</p>
              )}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xl font-semibold">Total: ${selectedOrder.total_price}</p>
                {selectedOrder.deliveryAddress && (
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-semibold">Delivery Address:</span>{' '}
                    {selectedOrder.deliveryAddress}
                  </p>
                )}
                {selectedOrder.deliveryInstructions && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Instructions:</span>{' '}
                    {selectedOrder.deliveryInstructions}
                  </p>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f0f0f0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #c1c1c1;
          border-radius: 10px;
          border: 2px solid #f0f0f0;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #c1c1c1 #f0f0f0;
        }
      `}</style>
    </div>
  );
}
