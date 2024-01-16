import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NewOrderCard from "./NeworderCard";
import AcceptedOrderCard from "./AcceptedOrderCard";
import SendindOrderCard from "./SendindOrders";
import socketIOClient from "socket.io-client";
import { setNewOrder } from "../../redux/actions/actions";

const Orders = () => {
    const activeShop = useSelector((state) => state.activeShop);
    const lastOrder = useSelector((state) => state.newOrder);
    const dispatch = useDispatch()
    console.log(lastOrder)

    const [orders, setOrders] = useState({
        "new order": [],
        accepted: [],
        sending: [],
        finished: [],
    });

    const socket = socketIOClient("http://localhost:3000");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/orders/get/${activeShop}`
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
            console.log("entro nueva orden")
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

    const handleAcceptOrder = async (orderId) => {
        console.log("cambiando estado")
        try {
            // Realiza una solicitud al servidor para cambiar el estado de la orden a "accepted"
            await axios.put(`http://localhost:3000/api/orders/accept/${orderId}`);

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
        console.log("cambiando estado")
        try {
            // Realiza una solicitud al servidor para cambiar el estado de la orden a "accepted"
            await axios.put(`http://localhost:3000/api/orders/send/${orderId}`);

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
        console.log("cambiando estado")
        try {
            // Realiza una solicitud al servidor para cambiar el estado de la orden a "accepted"
            await axios.put(`http://localhost:3000/api/orders/finished/${orderId}`);

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
        <div className="ml-[130px] mt-[100px]">
            <h3 className="text-lg font-semibold mt-2">Orders</h3>
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
