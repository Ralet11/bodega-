import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeShop } from "../../redux/actions/actions";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { getParamsEnv } from "../../functions/getParamsEnv";

const { API_URL_BASE } = getParamsEnv();

function Shops() {
    const client = useSelector((state) => state.client);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newShop, setNewShop] = useState({
        name: "",
        phone: "",
        address: "",
        category: ""
    });

    const selectLocal = (id) => {
        dispatch(changeShop(id));
        navigate("/dashboard");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewShop({ ...newShop, [name]: value });
    };

    const handleAddShop = () => {
        // Logic to add new shop goes here
        // Example: dispatch(addShop(newShop));
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto py-8 mt-12 px-5 lg:px-20">
            <div className="pb-5 text-center">
                <h3 className="text-2xl font-bold mt-2 text-gray-800">Your Shops</h3>
                <hr className="my-4 border-t border-gray-300 mx-auto w-1/2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {client.locals.map((local, index) => (
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
                            <div className="font-bold text-xl mb-2 text-gray-900">{local.name}</div>
                            <p className="text-gray-700 text-base">{local.address}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-400 transform transition duration-300 hover:scale-105"
                >
                    <PlusCircleIcon className="h-6 w-6" />
                    Add New Shop
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Add New Shop</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={newShop.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={newShop.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={newShop.address}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={newShop.category}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="mr-4 px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddShop}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Shops;