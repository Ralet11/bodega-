import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NewOrderCard from "./NeworderCard";
import AcceptedOrderCard from "./AcceptedOrderCard";
import SendindOrderCard from "./SendindOrders";
import socketIOClient from "socket.io-client";
import { setNewOrder } from "../../redux/actions/actions";

import { getParamsEnv } from "../../functions/getParamsEnv";

const {API_URL_BASE} = getParamsEnv(); 

const Orders = () => {
    const activeShop = useSelector((state) => state.activeShop);
    const lastOrder = useSelector((state) => state.newOrder);
    const dispatch = useDispatch()
   

  

    const [orders, setOrders] = useState({
        "new order": [],
        accepted: [],
        sending: [],
        finished: [],
    });

    const socket = socketIOClient("https://3.137.165.92");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${API_URL_BASE}/api/orders/get/${activeShop}`
                );

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
        // Listen for the "newOrder" event
        socket.on("newOrder", (data) => {
         
            setOrders((prevOrders) => {
                return {
                    ...prevOrders,
                    "new order": [...prevOrders["new order"], data],
                };
            });
        });

        // Clean up the WebSocket listener when the component unmounts
        return () => {
            socket.off("newOrder");
        };
    }, []);

  s

    const handleAcceptOrder = async (orderId) => {
   
        try {
            // Realiza una solicitud al servidor para cambiar el estado de la orden a "accepted"
            await axios.put(`${API_URL_BASE}/api/orders/accept/${orderId}`);

            // Actualiza localmente el estado de la orden cambiando su status
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
            // Realiza una solicitud al servidor para cambiar el estado de la orden a "accepted"
            await axios.put(`${API_URL_BASE}/api/orders/send/${orderId}`);

            // Actualiza localmente el estado de la orden cambiando su status
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
            // Realiza una solicitud al servidor para cambiar el estado de la orden a "accepted"
            await axios.put(`${API_URL_BASE}/api/orders/finished/${orderId}`);

            // Actualiza localmente el estado de la orden cambiando su status
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

   return (
        <div className="ml-20 mt-20">
            <h3 className="font-semibold">Orders</h3>
            <hr className="my-4 border-t border-gray-300" />
            <div className="grid grid-cols-3 gap-4 mt-4">
                {["new order", "accepted", "sending"].map((status, index) => (
                    <div key={status} className={`flex-1 ${index < 2 ? "border-r border-gray-300" : ""}`}>
                        <h3 className="text-base font-semibold mt-2">
                            {status === "new order" ? "New" : (status.charAt(0).toUpperCase() + status.slice(1))}
                        </h3>
                        <hr className="mb-5"></hr>
                        <div className="max-h-[500px] overflow-y-auto">
                            {orders[status].map((order, orderIndex) => {
                                const dateTimeString = order.date_time;

                                const dateTime = new Date(dateTimeString);
                                dateTime.setUTCHours(dateTime.getUTCHours() - 3);

                                const year = dateTime.getFullYear();
                                const month = String(dateTime.getMonth() + 1).padStart(2, '0');
                                const day = String(dateTime.getDate()).padStart(2, '0');
                                const date = `${year}-${month}-${day}`;

                                const hours = String(dateTime.getHours()).padStart(2, '0');
                                const minutes = String(dateTime.getMinutes()).padStart(2, '0');
                                const seconds = String(dateTime.getSeconds()).padStart(2, '0');
                                const time = `${hours}:${minutes}:${seconds}`;

                                return (
                                    <div
                                        key={order.id}
                                        className={orderIndex === 0 && status === "new order" && lastOrder ? "animate__animated animate__shakeX" : ""}
                                        onAnimationEnd={() => dispatch(setNewOrder(false)) } 
                                    >
                                        {status === "new order" ? (
                                            <NewOrderCard order={order} handleAcceptOrder={handleAcceptOrder} date={date} time={time} />
                                        ) : status === "accepted" ? (
                                            <AcceptedOrderCard order={order} handleSendOrder={handleSendOrder} date={date} time={time} />
                                        ) : (
                                            <SendindOrderCard order={order} handleFinishOrder={handleFinishOrder} date={date} time={time} />
                                        )}
                                    </div>
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
