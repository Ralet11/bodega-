import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    DocumentTextIcon
} from "@heroicons/react/24/solid";

const HistorialVentas = () => {
    const activeShop = useSelector((state) => state.activeShop);

    const [orders, setOrders] = useState({
        "new order": [],
        accepted: [],
        sending: [],
        finished: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:80/api/orders/get/${activeShop}`
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

    const formatDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);

        const year = dateTime.getFullYear();
        const month = String(dateTime.getMonth() + 1).padStart(2, '0');
        const day = String(dateTime.getDate()).padStart(2, '0');

        const hours = String(dateTime.getHours()).padStart(2, '0');
        const minutes = String(dateTime.getMinutes()).padStart(2, '0');
        const seconds = String(dateTime.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="flex flex-col mt-[80px] ml-[160px] max-w-[80%] max-h-[800px]">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table className="min-w-full text-center text-sm font-light">
                            <thead className="border-b bg-blue-800 font-medium text-white">
                                <tr>
                                    <th scope="col" className="px-6 py-4">#</th>
                                    <th scope="col" className="px-6 py-4">Date</th>
                                    <th scope="col" className="px-6 py-4">User Name</th>
                                    <th scope="col" className="px-6 py-4">Order Details</th>
                                    <th scope="col" className="px-6 py-4">Final Price</th>
                                    <th scope="col" className="px-6 py-4">Pay Method</th>
                                    <th scope="col" className="px-6 py-4">Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.finished.map((order, index) => (

                                    <tr key={order.id} className="border-b dark:border-neutral-500">
                                        <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{formatDateTime(order.date_time)}</td>
                                        <td className="whitespace-nowrap px-6 py-4">Nombre usuario</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <DocumentTextIcon className="h-6 w-6 text-blue-500 ml-[60px]" />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">{order.total_price}</td>
                                        <td className="whitespace-nowrap px-6 py-4">Credit Card</td>
                                        <td className="whitespace-nowrap px-6 py-4">User Adress</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistorialVentas;