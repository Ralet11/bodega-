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

  // Get orderId and token from the URL
  const orderId = searchParams.get("orderId");
  const token = searchParams.get("token");

  useEffect(() => {
    const acceptOrder = async () => {
      try {
        // Call your backend endpoint to accept the order
        const response = await axios.get(
          `${API_URL_BASE}/api/orders/acceptByEmail?orderId=${orderId}&token=${token}`
        );

        if (response.data.error) {
          setError(response.data.message || "An error occurred while accepting your order.");
        } else {
          setError(null);
        }
      } catch (err) {
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

  // Success state for the owner view
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold text-green-600">
          You've accepted the order!
        </h2>
        <p className="mt-4 text-gray-600">
          You can now continue managing your orders from your dashboard.
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Manage Orders
        </button>
      </div>
    </div>
  );
};

export default OrderAccepted;
