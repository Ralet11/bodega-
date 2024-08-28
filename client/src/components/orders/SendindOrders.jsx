import React, { useState } from "react";
import {
  DocumentTextIcon,
  XCircleIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import OrderModal from "../modal/OrderModal";

const SendingOrderCard = ({ order, handleFinishOrder, time, handleRejectOrder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <>
      <div className="bg-blue-100 border border-gray-300 rounded-lg shadow-md p-4 mb-4 flex flex-col justify-between w-72 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-base">
            Order N°: {order.id} - {formatOrderCode(order.code)}
          </h3>
          <span className="px-2 py-1 rounded text-white text-xs bg-blue-500">
            {order.type}
          </span>
        </div>
        <div className="flex-1 mb-4">
          <p className="text-xs text-gray-600 mb-1">
            <span className="font-semibold">User:</span> Nombre usuario
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Total:</span> ${Number(order.total_price).toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            onClick={openModal}
            onMouseEnter={(e) => showTooltip(e, "Detail")}
            onMouseLeave={(e) => hideTooltip(e)}
            className="relative cursor-pointer"
          >
            <DocumentTextIcon className="h-4 w-4 text-blue-500" />
            <span className="tooltip absolute bg-gray-700 text-white text-xs rounded py-1 px-2 hidden">Detail</span>
          </div>
          <div
            onClick={() => handleFinishOrder(order.id)}
            onMouseEnter={(e) => showTooltip(e, "Finish")}
            onMouseLeave={(e) => hideTooltip(e)}
            className="relative cursor-pointer"
          >
            <CheckBadgeIcon className="h-4 w-4 text-green-500" />
            <span className="tooltip absolute bg-gray-700 text-white text-xs rounded py-1 px-2 hidden">Finish</span>
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <OrderModal order={order} closeModal={closeModal} />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SendingOrderCard;
