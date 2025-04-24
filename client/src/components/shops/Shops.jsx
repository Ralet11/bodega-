import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeShop, loginSuccess } from "../../redux/actions/actions";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { getParamsEnv } from "../../functions/getParamsEnv";
import { resetClient } from "../../functions/ResetClient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "./card";

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
    name: "",
    address: "",
    phone: "",
    lat: 85.65,
    lng: 60.45,
    clientId: client.client.id,
    category: "",
  });
  const [selectedShop, setSelectedShop] = useState("");
  const [loading, setLoading] = useState(true);

  const selectShop = (id) => {
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
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.statusText === "OK") {
        setIsAddModalOpen(false);
        const clientRes = await resetClient(client.client.id, token);
        dispatch(loginSuccess(clientRes.client));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteShop = async () => {
    try {
      const response = await axios.put(
        `${API_URL_BASE}/api/local/update/${selectedShop}`,
        { status: "0" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.statusText === "OK") {
        setIsDeleteModalOpen(false);
        const clientRes = await resetClient(client.client.id, token);
        dispatch(loginSuccess(clientRes.client));
      }
    } catch (error) {
      console.error(error);
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
    const refreshClient = async () => {
      try {
        const clientRes = await resetClient(client.client.id, token);
        dispatch(loginSuccess(clientRes.client));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (token) refreshClient();
  }, [dispatch, client.client.id, token]);

  const activeShops = client.locals.filter((local) => local.status !== "0");

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 lg:px-10 mx-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Shops</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-4"
            >
              <Skeleton height={160} />
              <div className="mt-4">
                <Skeleton height={24} width="80%" />
                <Skeleton height={16} width="60%" className="mt-2" />
              </div>
            </div>
          ))
        ) : (
          activeShops.map((local) => (
            <div
              key={local.id}
              onClick={() => selectShop(local.id)}
              className="cursor-pointer"
            >
              <Card
                imageSource={local.logo}
                title={local.name}
                text={local.address}
                url="#!" // Navigation is handled on card click
                badge={
                  local.status === "1"
                    ? "Pending: Certificates not published"
                    : null
                }
              />
            </div>
          ))
        )}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1 px-5 py-2 bg-blue-600 text-white rounded-md font-bold transition duration-300 hover:bg-blue-700"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Shop
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex items-center gap-1 px-5 py-2 bg-red-600 text-white rounded-md font-bold transition duration-300 hover:bg-red-700"
        >
          Delete Shop
        </button>
      </div>

      {/* Add Shop Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Add New Shop
            </h2>
            <form onSubmit={handleSubmitAdd}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Shop Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Delete Shop
            </h2>
            <form onSubmit={handleSubmitDelete}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-1">
                  Select Shop to Delete
                </label>
                <select
                  name="selectedShop"
                  value={selectedShop}
                  onChange={(e) => setSelectedShop(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">Select a shop</option>
                  {client.locals.map((local) => (
                    <option key={local.id} value={local.id}>
                      {local.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
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
