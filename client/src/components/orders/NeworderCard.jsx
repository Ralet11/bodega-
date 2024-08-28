import React, { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import OrderModal from "../modal/OrderModal";
import axios from "axios";
import { getParamsEnv } from "../../functions/getParamsEnv";
import { useSelector } from "react-redux";

const { API_URL_BASE } = getParamsEnv();

const NewOrderCard = ({ order, handleAcceptOrder, time, handleRejectOrder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state?.client.token);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showTooltip = (event, text) => {
    const tooltip = event.currentTarget.querySelector(".tooltip");
    tooltip.style.display = "block";
    tooltip.textContent = text;
  };

  const hideTooltip = (event) => {
    const tooltip = event.currentTarget.querySelector(".tooltip");
    tooltip.style.display = "none";
  };

  const formatOrderCode = (code) => {
    const upperCaseCode = code.toUpperCase();
    return `${upperCaseCode.slice(0, 3)}-${upperCaseCode.slice(3, 6)}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(`${API_URL_BASE}/api/orders/user/${order.users_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    };

    fetchUserData();
  }, [order.users_id, token]);

  if (!userData) {
    return null;
  }

  const orderDateTime = new Date(order.date_time);
  const currentDateTime = new Date();
  const timeDifference = (currentDateTime - orderDateTime) / (1000 * 60); // Diferencia en minutos

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-sm p-2 mb-2 flex flex-col justify-between w-64 max-w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">
          Order N°: {order.id} - {formatOrderCode(order.code)}
        </h3>
        <span
          className={`px-1 py-0.5 rounded text-white text-xs ${
            order.type === "pick up" ? "bg-blue-400" : "bg-red-400"
          }`}
        >
          {order.type}
          {timeDifference > 15 && (
            <ExclamationCircleIcon className="h-4 w-4 text-red-500 inline ml-2" />
          )}
        </span>
      </div>
      <div className="flex-1 mb-2">
        <p className="text-xs text-gray-600 mb-1">
          <span className="font-medium">User:</span> {userData.name}
        </p>
        <p className="text-xs text-gray-600">
          <span className="font-medium">Total:</span> ${Number(order.total_price).toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div
          onClick={() => openModal()}
          onMouseEnter={(e) => showTooltip(e, "Detail")}
          onMouseLeave={(e) => hideTooltip(e)}
          className="relative cursor-pointer"
        >
          <DocumentTextIcon className="h-4 w-4 text-blue-500" />
          <span className="tooltip absolute bg-gray-700 text-white text-xs rounded py-1 px-2 hidden">Detail</span>
        </div>
        <div
          onClick={() => handleAcceptOrder(order.id)}
          onMouseEnter={(e) => showTooltip(e, "Accept")}
          onMouseLeave={(e) => hideTooltip(e)}
          className="relative cursor-pointer"
        >
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
          <span className="tooltip absolute bg-gray-700 text-white text-xs rounded py-1 px-2 hidden">Accept</span>
        </div>
        <div
          onClick={() => handleRejectOrder(order.id)}
          onMouseEnter={(e) => showTooltip(e, "Reject")}
          onMouseLeave={(e) => hideTooltip(e)}
          className="relative cursor-pointer"
        >
          <XCircleIcon className="h-4 w-4 text-red-500" />
          <span className="tooltip absolute bg-gray-700 text-white text-xs rounded py-1 px-2 hidden">Reject</span>
        </div>
        <span className="ml-auto text-xs text-gray-500">{time}</span>
      </div>
      {isModalOpen && <OrderModal order={order} closeModal={closeModal} />}
    </div>
  );
};

export default NewOrderCard;
