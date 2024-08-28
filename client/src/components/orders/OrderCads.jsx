import React from "react";
import {
  DocumentTextIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

const OrderCard = ({ order, time, status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
        case "cancelled":
          return "bg-gray-600 border-gray-700 text-white";
        case "rejected":
          return "bg-red-500 border-red-600 text-black";  // Rojo más oscuro con texto negro
        case "finished":
          return "bg-yellow-500 border-yellow-600 text-black";  // Amarillo más oscuro con texto negro
        default:
          return "bg-white border-gray-300 text-black";
      }
  };

  return (
    <div
      className={`border rounded-md shadow-sm p-2 mb-2 flex flex-col justify-between w-64 max-w-full ${getStatusStyles(
        status
      )}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-semibold text-sm ${status === "cancelled" ? "text-white" : "text-black"}`}>
          Order N°: {order.id}
        </h3>
        <span className={`px-1 py-0.5 rounded text-xs ${status === "cancelled" ? "text-white" : "text-black"}`}>
          {order.type}
        </span>
      </div>
      <div className="flex-1 mb-2">
        <p className={`text-xs ${status === "cancelled" ? "text-gray-100" : "text-black"} mb-1`}>
          <span className="font-medium">User:</span> Nombre usuario
        </p>
        <p className={`text-xs ${status === "cancelled" ? "text-gray-100" : "text-black"}`}>
          <span className="font-medium">Total:</span> $
          {Number(order.total_price).toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative cursor-pointer">
          <DocumentTextIcon className={`${status === "cancelled" ? "text-white" : "text-black"} h-4 w-4`} />
        </div>
        
        <span className={`ml-auto text-xs ${status === "cancelled" ? "text-gray-100" : "text-black"}`}>{time}</span>
      </div>
    </div>
  );
};

export default OrderCard;