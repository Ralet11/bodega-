import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    DocumentTextIcon
} from "@heroicons/react/24/solid";
import { getParamsEnv } from "../../functions/getParamsEnv";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';

const { API_URL_BASE } = getParamsEnv();

const HistorialVentas = () => {
    const activeShop = useSelector((state) => state.activeShop);
    const token = useSelector((state) => state?.client.token)

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
                    `${API_URL_BASE}/api/orders/get/${activeShop}`, {
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
        <div>
            <div className="pl-5 md:pl-20 mt-20 md:ml-8 md:pt-0.5 pb-5">
                <h3 className="text-lg font-semibold mt-2">Orders History</h3>
                <hr className="my-4 border-t border-gray-300" />
            </div>
            <div className='px-2  md:ml-20 md:pl-20 w-full md:w-4/5'>
                <div className="overflow-x-auto">
                    <Table className="min-w-full text-center text-sm font-light">
                        <TableHead className="bg-gray-50">
                            <TableRow>
                                <TableHeadCell className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    #
                                </TableHeadCell>
                                <TableHeadCell className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </TableHeadCell>
                                <TableHeadCell className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User Name
                                </TableHeadCell>
                                <TableHeadCell className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Details
                                </TableHeadCell>
                                <TableHeadCell className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Final Price
                                </TableHeadCell>
                                <TableHeadCell className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pay Method
                                </TableHeadCell>
                                <TableHeadCell className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Address
                                </TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.finished.map((order, index) => (
                                <TableRow key={order.id}>
                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white px-3 py-2">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {formatDateTime(order.date_time)}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        Nombre usuario
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        <DocumentTextIcon className="h-6 w-6 text-blue-500 ml-[60px]" />
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {order.total_price}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        Credit Card
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        User Address
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>

    );
}

export default HistorialVentas;
