import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NewOrderCard from "./NeworderCard";
import AcceptedOrderCard from "./AcceptedOrderCard";
import SendingOrderCard from "./SendindOrders";
import OrderCard from "./OrderCads";
import socketIOClient from "socket.io-client";
import { setNewOrder } from "../../redux/actions/actions";
import { getParamsEnv } from "../../functions/getParamsEnv";

const { API_URL_BASE } = getParamsEnv();

const Orders = () => {
  const activeShop = useSelector((state) => state.activeShop);
  const lastOrder = useSelector((state) => state.newOrder);
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.client.token);

  const [orders, setOrders] = useState({
    "new order": [],
    accepted: [],
    sending: [],
    finished: [],
    cancelled: [],
    rejected: [],
  });

  const socket = socketIOClient("http://localhost:80");

  // Función para hacer la llamada y traer todas las órdenes
  const fetchOrders = async () => {
    try {
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        `${API_URL_BASE}/api/orders/get/${activeShop}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ordersByStatus = {
        "new order": [],
        accepted: [],
        sending: [],
        finished: [],
        cancelled: [],
        rejected: [],
      };

      response.data.orders.forEach((order) => {
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

  // Llamada inicial para cargar las órdenes
  useEffect(() => {
    fetchOrders();
  }, [activeShop, token]);

  // WebSocket listener para nuevas órdenes
  useEffect(() => {
    const handleNewOrder = async (data) => {
      try {
        // Vuelve a hacer la llamada al backend para actualizar todas las órdenes
        await fetchOrders();
        console.log("New order received and orders updated:", data);
      } catch (error) {
        console.error("Error fetching full order data:", error);
      }
    };

    socket.on("newOrder", handleNewOrder);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      socket.off("newOrder", handleNewOrder);
    };
  }, [socket, token, activeShop]);

  // Función para aceptar una orden
  const handleAcceptOrder = async (orderId) => {
    try {
      await axios.put(
        `${API_URL_BASE}/api/orders/accept/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Después de aceptar la orden, recargar todas las órdenes
      await fetchOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  // Función para enviar una orden
  const handleSendOrder = async (orderId) => {
    try {
      await axios.put(`${API_URL_BASE}/api/orders/send/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      // Después de enviar la orden, recargar todas las órdenes
      await fetchOrders();
    } catch (error) {
      console.error("Error sending order:", error);
    }
  };

  // Función para finalizar una orden
  const handleFinishOrder = async (orderId) => {
    try {
      await axios.put(`${API_URL_BASE}/api/orders/finished/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      // Después de finalizar la orden, recargar todas las órdenes
      await fetchOrders();
    } catch (error) {
      console.error("Error finishing order:", error);
    }
  };

  // Función para rechazar una orden
  const handleRejectOrder = async (orderId) => {
    try {
      await axios.post(`${API_URL_BASE}/api/orders/rejected`,
        { id: orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Después de rechazar la orden, recargar todas las órdenes
      await fetchOrders();
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  return (
    <div className="ml-5 md:ml-20 mt-20">
      <div className="pb-5 text-center">
        <h3 className="text-lg md:text-2xl font-bold mt-2 text-gray-800">Orders</h3>
        <hr className="my-4 border-t border-gray-300 mx-auto w-1/2" />
      </div>
      
      {/* Primera fila: New, Accepted, Pick Up */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
        {["new order", "accepted", "sending"].map((status, index) => (
          <div
            key={status}
            className={`flex-1 ${index < 2 ? "md:border-r border-gray-300" : ""}`}
          >
            <h3 className="text-base font-semibold mt-2">
              {status === "new order"
                ? "New"
                : status === "accepted"
                ? "Accepted"
                : "Pick up"}
            </h3>
            <hr className="mb-5" />
            <div className="max-h-[300px] overflow-y-auto">
              {[...orders[status]].reverse().map((order, orderIndex) => {
                const dateTimeString = order.date_time;
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

                return (
                  <div
                    key={order.id}
                    className={
                      orderIndex === 0 && status === "new order" && lastOrder
                        ? "animate__animated animate__shakeX"
                        : ""
                    }
                    onAnimationEnd={() => dispatch(setNewOrder(false))}
                  >
                    {status === "new order" ? (
                      <NewOrderCard
                        order={order}
                        handleAcceptOrder={handleAcceptOrder}
                        date={date}
                        time={time}
                        handleFinishOrder={handleFinishOrder}
                        handleRejectOrder={handleRejectOrder}
                      />
                    ) : status === "accepted" ? (
                      <AcceptedOrderCard
                        order={order}
                        handleSendOrder={handleSendOrder}
                        date={date}
                        time={time}
                        handleRejectOrder={handleRejectOrder}
                      />
                    ) : (
                      <SendingOrderCard
                        order={order}
                        handleFinishOrder={handleFinishOrder}
                        date={date}
                        time={time}
                        handleRejectOrder={handleRejectOrder}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Segunda fila: Cancelled, Rejected, Finished */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
        {["cancelled", "rejected", "finished"].map((status, index) => (
          <div
            key={status}
            className={`flex-1 ${index < 2 ? "md:border-r border-gray-300" : ""}`}
          >
            <h3 className="text-base font-semibold mt-2">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h3>
            <hr className="mb-5" />
            <div className="max-h-[300px] overflow-y-auto">
              {[...orders[status]].reverse().map((order, orderIndex) => {
                const dateTimeString = order.date_time;
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

                return (
                  <OrderCard
                    key={order.id}
                    order={order}
                    time={time}
                    status={status}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;