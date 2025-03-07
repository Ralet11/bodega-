import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getParamsEnv } from "../functions/getParamsEnv";
const { API_URL_BASE } = getParamsEnv();
const OrderAccepted = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtenemos el orderId y el token desde la URL
  const orderId = searchParams.get("orderId");
  const token = searchParams.get("token");

  useEffect(() => {
    const acceptOrder = async () => {
      try {
        // Llamada al endpoint de tu backend para aceptar la orden
        const response = await axios.get(
          `${API_URL_BASE}/api/orders/acceptByEmail?orderId=${orderId}&token=${token}`
        );

        if (response.data.error) {
          // Si el backend indica un error, lo guardamos en el estado
          setError(response.data.message || "An error occurred while accepting your order.");
        } else {
          // Si no hay error, asumimos que la orden se aceptó correctamente
          setError(null);
        }
      } catch (err) {
        // Capturamos errores de red, etc.
        setError(
          err.response?.data?.message ||
            "An error occurred while accepting your order."
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId && token) {
      acceptOrder();
    } else {
      setError("Missing order parameters.");
      setLoading(false);
    }
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-gray-700 text-lg">Accepting your order...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Order Acceptance Error
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Si no hay error y no estamos cargando, significa que se aceptó con éxito
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold text-green-600">
          Your order has been accepted successfully!
        </h2>
        <p className="mt-4 text-gray-600">
          Thank you for using our service. You can now check your order status.
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Go to My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderAccepted;
