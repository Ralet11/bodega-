import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import axios from 'axios';
import { getParamsEnv } from './../functions/getParamsEnv.js';
import { useDispatch, useSelector } from "react-redux";
import Modal from './Modal'

const { API_URL_BASE } = getParamsEnv();

const DistPurchaseHistory = () => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit'
        });
        return formattedDate;
    };
    const token = useSelector((state) => state?.client.token)
    const activeShop = useSelector((state) => state.activeShop);
    const [orders, setOrders] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.post(`${API_URL_BASE}/api/distOrder/getByLocalId`, { local_id: activeShop }, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                setOrders(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchOrders();
    }, []);

    const handleDetailsClick = (products) => {
      console.log("1")
        setSelectedProducts(products);
        setShowModal(true);
    }


    console.log(selectedProducts)
    return (
        <>
            <div className='ml-20 mt-20'>
                <div className='pl-5 pb-10'>
                    <h3 className="text-lg font-semibold mt-2">Your buys</h3>
                    <hr className="my-4 border-t border-gray-300" />
                </div>
                <div className='m-auto w-4/5'>
                <div className="overflow-y-auto max-h-[680px]">
                    <Table hoverable>
                        <TableHead>
                            <TableHeadCell className="sticky top-0 bg-white dark:bg-gray-800 z-10">Order Id</TableHeadCell>
                            <TableHeadCell className="sticky top-0 bg-white dark:bg-gray-800 z-10">Details</TableHeadCell>
                            <TableHeadCell className="sticky top-0 bg-white dark:bg-gray-800 z-10">Date</TableHeadCell>
                            <TableHeadCell className="sticky top-0 bg-white dark:bg-gray-800 z-10">Status</TableHeadCell>
                            <TableHeadCell className="sticky top-0 bg-white dark:bg-gray-800 z-10">Payment</TableHeadCell>
                            <TableHeadCell className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                                <span className="sr-only">Edit</span>
                            </TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {orders.map(order => (
                                <TableRow key={order.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {order.id}
                                    </TableCell>
                                    <TableCell>
                                        <button className='border border-black hover:text-black' onClick={() => handleDetailsClick(order.products)}>Details</button>
                                    </TableCell>
                                    <TableCell>{formatDate(order.date)}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>${order.total}</TableCell>
                                    <TableCell>
                                        <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                            Edit
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                </div>
            </div>
            {showModal && (
    <Modal onClose={() => setShowModal(false)}>
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Details</h2>
            <ul>
                {selectedProducts.map(product => (
                    <li key={product.id} className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img src={product.DistProduct.image1} alt={product.DistProduct.name} className="w-16 h-16 rounded-full" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{product.DistProduct.name}</h3>
                                <p className="text-sm text-gray-600">Price: ${product.DistProduct.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-600">{product.quantity}x</p>
                            <p className="text-lg font-semibold">${(product.DistProduct.price * product.quantity).toFixed(2)}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-6 flex justify-between items-center border-t pt-4">
                <p className="text-lg font-semibold text-gray-800">Total:</p>
                <p className="text-lg font-semibold text-green-600">${selectedProducts.reduce((acc, product) => acc + product.DistProduct.price * product.quantity, 0).toFixed(2)}</p>
            </div>
        </div>
    </Modal>
)}
        </>
    );
}

export default DistPurchaseHistory;