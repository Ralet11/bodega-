import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NewOrderCard from "./NeworderCard";
import AcceptedOrderCard from "./AcceptedOrderCard";
import SendindOrderCard from "./SendindOrders";
import socketIOClient from "socket.io-client";
import { setNewOrder } from "../../redux/actions/actions";
import { getParamsEnv } from "../../functions/getParamsEnv";
import { Search } from "lucide-react";

const { API_URL_BASE } = getParamsEnv();

const Orders = () => {
  const activeShop = useSelector((state) => state.activeShop);
  const lastOrder = useSelector((state) => state.newOrder);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [orders, setOrders] = useState({
    "new order": [],
    accepted: [],
    sending: [],
    finished: [],
  });

  const socket = socketIOClient("http://localhost:80");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/orders/get/${activeShop}`);

        const ordersByStatus = {
          "new order": [],
          accepted: [],
          sending: [],
          finished: [],
        };

        response.data.forEach((order) => {
          const status = order.status;
          if (status in ordersByStatus) {
            ordersByStatus[status].push(order);
          }
        });

        setOrders(ordersByStatus);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [activeShop]);

  useEffect(() => {
    // Escuchar el evento "newOrder"
    socket.on("newOrder", (data) => {
      setOrders((prevOrders) => ({
        ...prevOrders,
        "new order": [...prevOrders["new order"], data],
      }));
    });

    // Limpiar el listener de socket al desmontar
    return () => {
      socket.off("newOrder");
    };
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      await axios.put(`${API_URL_BASE}/api/orders/accept/${orderId}`);
      setOrders((prevOrders) => {
        const updatedOrders = { ...prevOrders };
        const orderToUpdateIndex = updatedOrders["new order"].findIndex((order) => order.id === orderId);

        if (orderToUpdateIndex !== -1) {
          const orderToUpdate = JSON.parse(JSON.stringify(updatedOrders["new order"][orderToUpdateIndex]));
          orderToUpdate.status = "accepted";
          updatedOrders.accepted.push(orderToUpdate);
          updatedOrders["new order"].splice(orderToUpdateIndex, 1);
        }

        return updatedOrders;
      });
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleSendOrder = async (orderId) => {
    try {
      await axios.put(`${API_URL_BASE}/api/orders/send/${orderId}`);
      setOrders((prevOrders) => {
        const updatedOrders = { ...prevOrders };
        const orderToUpdateIndex = updatedOrders["accepted"].findIndex((order) => order.id === orderId);

        if (orderToUpdateIndex !== -1) {
          const orderToUpdate = JSON.parse(JSON.stringify(updatedOrders["accepted"][orderToUpdateIndex]));
          orderToUpdate.status = "sending";
          updatedOrders.sending.push(orderToUpdate);
          updatedOrders["accepted"].splice(orderToUpdateIndex, 1);
        }

        return updatedOrders;
      });
    } catch (error) {
      console.error("Error sending order:", error);
    }
  };

  const handleFinishOrder = async (orderId) => {
    try {
      await axios.put(`${API_URL_BASE}/api/orders/finished/${orderId}`);
      setOrders((prevOrders) => {
        const updatedOrders = { ...prevOrders };
        const orderToUpdateIndex = updatedOrders["sending"].findIndex((order) => order.id === orderId);

        if (orderToUpdateIndex !== -1) {
          const orderToUpdate = JSON.parse(JSON.stringify(updatedOrders["sending"][orderToUpdateIndex]));
          orderToUpdate.status = "finished";
          updatedOrders.finished.push(orderToUpdate);
          updatedOrders["sending"].splice(orderToUpdateIndex, 1);
        }

        return updatedOrders;
      });
    } catch (error) {
      console.error("Error sending order:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    dateTime.setUTCHours(dateTime.getUTCHours() - 3);

    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day}`;

    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const seconds = String(dateTime.getSeconds()).padStart(2, "0");
    const time = `${hours}:${minutes}:${seconds}`;

    return { date, time };
  };

  return (
    <div className="order-dashboard p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Order Dashboard</h1>
        
        <div className="search-container flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter order code"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button className="search-button flex items-center bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-md">
            <Search className="h-5 w-5" />
            <span className="ml-1">Search</span>
          </button>
        </div>
      </div>

      {/* Tabs de Dine-In y Pickup con colores corregidos */}
      <div className="mb-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${activeTab === "dine-in"
              ? "bg-amber-500 text-white"
              : "bg-gray-200 text-red-700 hover:bg-gray-300"}
          `}
          onClick={() => setActiveTab("dine-in")}
        >
          <span className="mr-1">🍽️</span> Dine-In
        </button>

        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${activeTab === "pickup"
              ? "bg-amber-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
          `}
          onClick={() => setActiveTab("pickup")}
        >
          <span className="mr-1">📦</span> Pickup
        </button>
      </div>

      <div className="order-columns grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { id: "new order", label: "New Orders" },
          { id: "accepted", label: "In Preparation" },
          { id: "sending", label: "Ready" },
          { id: "finished", label: "Finished" },
        ].map((column) => (
          <div key={column.id} className="order-column bg-white rounded-md shadow p-4">
            <div className="order-column-header text-lg font-semibold mb-2 border-b pb-2">
              {column.label}
            </div>
            <div className="order-column-content custom-scrollbar max-h-[400px] overflow-y-auto">
              {orders[column.id].length > 0 ? (
                orders[column.id].map((order) => {
                  const { date, time } = formatDateTime(order.date_time);
                  const isNewHighlight = column.id === "new order" && lastOrder;
                  
                  return (
                    <div
                      key={order.id}
                      className={`order-card mb-4 p-3 border border-gray-200 rounded-md ${
                        isNewHighlight ? "new-order-highlight" : ""
                      }`}
                      onAnimationEnd={() => dispatch(setNewOrder(false))}
                    >
                      {column.id === "new order" ? (
                        <NewOrderCard
                          order={order}
                          handleAcceptOrder={handleAcceptOrder}
                          date={date}
                          time={time}
                        />
                      ) : column.id === "accepted" ? (
                        <AcceptedOrderCard
                          order={order}
                          handleSendOrder={handleSendOrder}
                          date={date}
                          time={time}
                        />
                      ) : column.id === "sending" ? (
                        <SendindOrderCard
                          order={order}
                          handleFinishOrder={handleFinishOrder}
                          date={date}
                          time={time}
                        />
                      ) : (
                        <div className="order-finished">
                          <div className="order-card-header flex justify-between items-center">
                            <span className="order-id font-medium text-gray-700">#{order.id}</span>
                            <span className="order-time text-sm text-gray-500">{date} {time}</span>
                          </div>
                          <div className="order-total mt-2 flex justify-between items-center">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-semibold text-gray-800">${order.total}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="no-orders text-gray-500">No orders available.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
