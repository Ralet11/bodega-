import React, { useState } from "react";
import {
  DocumentTextIcon,
  XCircleIcon,
  PlayCircleIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/solid";
import OrderModal from "../modal/OrderModal";

const SendindOrderCard = ({ order, handleFinishOrder, time }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const cardStyles = {
    backgroundColor: "#c6f1ff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    minWidth: "200px",
    minHeight: "100px",
    maxWidth: "400px",
    maxHeight: "150px"
  };

  const headerStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  };

  const orderNumberStyles = {
    fontSize: "15px",
    fontWeight: "bold",
  };

  const statusStyles = {
    backgroundColor: "#3399FF",
    color: "#ffffff",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "0.875rem",
  };

  const iconStyles = {
    color: "#ffffff", // Color del icono
    marginRight: "5px", // Espacio entre el icono y el texto
  };
  

  

  return (
    <div style={cardStyles}>
      <div style={headerStyles}>
        <h3 style={orderNumberStyles}>Order N°: {order.id}</h3>
        <span style={statusStyles}>{order.status}</span>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "8px" }}>
          <span>user: Nombre usuario</span>
          <span className="ml-[80px]">Address:</span>
        </p>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "8px" }}>
        <span>Total: { Number(order.total_price).toFixed(2)}</span>
          <span className="ml-[95px]">Payment Method: Credit Card</span>
        </p>
      </div>
      <div className="flex gap-5">
        <div onClick={() => openModal()}>
          <span style={iconStyles}>
          <DocumentTextIcon className="h-6 w-6 inline text-blue-500 cursor-pointer" />


          </span>
        </div>
        <div onClick={() => handleFinishOrder(order.id)}>
          <span style={iconStyles}>
            <CheckBadgeIcon className="h-6 w-6 inline text-green-500" />
          </span>
        </div>
        <div onClick={() => handleFinishOrder()}>
          <span style={iconStyles}>
            <XCircleIcon className="h-7 w-7 inline text-red-500" />
          </span>
        </div>
        <span className="ml-[50px]">{time}</span>
      </div>
      {isModalOpen && <OrderModal order={order} closeModal={closeModal} />}
    </div>
  );
};

export default SendindOrderCard;
