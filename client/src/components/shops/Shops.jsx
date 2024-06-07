import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeShop, loginSuccess } from "../../redux/actions/actions";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { getParamsEnv } from "../../functions/getParamsEnv";
import { resetClient } from "../../functions/ResetClient";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const { API_URL_BASE } = getParamsEnv();

function Shops() {
    const client = useSelector((state) => state.client);
    const token = client.token;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categories = useSelector((state) => state.categories);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        lat: 85.65,
        lng: 60.45,
        clientId: client.client.id,
        category: ''
    });
    const [selectedShop, setSelectedShop] = useState('');
    const [loading, setLoading] = useState(true);

    const selectLocal = (id) => {
        dispatch(changeShop(id));
        navigate("/dashboard");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddShop = async () => {
        try {
            const response = await axios.post(`${API_URL_BASE}/api/local/add`, formData, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
            });
            if (response.statusText === "OK") {
                console.log("Shop added successfully");
                setIsAddModalOpen(false);
                const clientRes = await resetClient(client.client.id, token)
                dispatch(loginSuccess(clientRes.client));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteShop = async () => {
        try {
            const response = await axios.put(`${API_URL_BASE}/api/local/update/${selectedShop}`, {
                status: '0'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.statusText === "OK") {
                console.log("Shop status updated to 0");
                setIsDeleteModalOpen(false);
                const clientRes = await resetClient(client.client.id, token)
                dispatch(loginSuccess(clientRes.client));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        handleAddShop();
    };

    const handleSubmitDelete = async (e) => {
        e.preventDefault();
        handleDeleteShop();
    };

    useEffect(() => {
        const resClient = async () => {
            try {
                const clientRes = await resetClient(client.client.id, token);
                console.log(clientRes, "clientRes");
                dispatch(loginSuccess(clientRes.client));
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        if (token) {
            resClient();
        }
    }, [dispatch, client.client.id, token]);

    // Filtrar las tiendas con status='1'
    const activeShops = client.locals.filter(local => local.status === '1');

    return (
        <div className="container h-screen bg-gray-200 w-full pb-20 mx-auto md:py-8 mt-12 px-5 lg:px-20">
            <div className="md:pb-5 text-center">
                <h3 className="text-lg md:text-2xl font-bold md:mt-2 text-gray-800">Your Shops</h3>
                <hr className="my-4 border-t border-gray-300 mx-auto w-1/2" />
            </div>
            <div className="grid md:ml-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(4)].map((_, index) => (
                        <div key={index} className="bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl cursor-pointer transform transition duration-300 hover:scale-105">
                            <Skeleton height={192} />
                            <div className="px-6 py-4">
                                <Skeleton height={30} width="80%" />
                                <Skeleton height={20} width="60%" />
                            </div>
                        </div>
                    ))
                ) : (
                    activeShops.map((local, index) => (
                        <div
                            onClick={() => selectLocal(local.id)}
                            key={index}
                            className="bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl cursor-pointer transform transition duration-300 hover:scale-105"
                        >
                            <img
                                src={local.img}
                                alt={local.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="px-6 py-4">
                                <div className="font-bold text-xs md:text-xl mb-2 text-gray-900">{local.name}</div>
                                <p className="text-gray-700 text-xs md:text-lg">{local.address}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="mt-6 flex justify-center gap-4">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex font-bold items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-400 transform transition duration-300 hover:scale-105"
                >
                    <PlusCircleIcon className="h-6 w-6" />
                    Add New Shop
                </button>
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex font-bold items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-md focus:outline-none hover:bg-red-400 transform transition duration-300 hover:scale-105"
                >
                    Delete Shop
                </button>
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Add New Shop</h2>
                        <form onSubmit={handleSubmitAdd}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="mr-4 px-4 py-2 bg-gray-300 rounded"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Delete Shop</h2>
                        <form onSubmit={handleSubmitDelete}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Select Shop to Delete</label>
                                <select
                                    name="selectedShop"
                                    value={selectedShop}
                                    onChange={(e) => setSelectedShop(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="">Select a shop</option>
                                    {client.locals.map((local) => (
                                        <option key={local.id} value={local.id}>
                                            {local.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="mr-4 px-4 py-2 bg-gray-300 rounded"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Shops;
