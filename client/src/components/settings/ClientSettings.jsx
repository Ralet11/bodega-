import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getParamsEnv } from "../../functions/getParamsEnv";
import { loginSuccess, setClient } from '../../redux/actions/actions';
import { resetClient } from '../../functions/ResetClient';

const { API_URL_BASE } = getParamsEnv();

export default function ClientSettings() {
  const client = useSelector((state) => state.client.client); // Obtenemos solo los datos del cliente
  const token = useSelector((state) => state.client.token);
  const locals = useSelector((state) => state.client.locals) // Obtenemos el token
  const [aux, setAux] = useState(false);
  const dispatch = useDispatch();

  console.log(client, "client");
  // Inicializamos el estado del formulario con los valores del cliente
  const [userData, setUserData] = useState({
    name: client.name || '',
    phone: client.phone || '',
    email: client.email || '',
    accountNumber: client.account_number || '',
    accountHolderName: client.account_holder_name || '',
    routingNumber: client.routing_number || '',
  });

  useEffect(() => {
    const resClient = async () => {
      try {
        const clientRes = await resetClient(client.id, token);
        console.log(clientRes, "clientRes");
        dispatch(loginSuccess(clientRes.client));
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      resClient();
    }
  }, [dispatch, client.id, token, aux]);

  useEffect(() => {
    // Aseguramos que el estado se actualiza cuando el cliente cambia
    setUserData({
      name: client.name || '',
      phone: client.phone || '',
      email: client.email || '',
    accountNumber: client.account_number || '',
    accountHolderName: client.account_holder_name || '',
    routingNumber: client.routing_number || '',
    });
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Enviamos los datos actualizados al servidor
      await axios.put(`${API_URL_BASE}/api/clients/update`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizamos el store con los nuevos datos del cliente
      setAux(!aux)
      toast.success('User data updated successfully.');
    } catch (error) {
      toast.error('Error updating user data.');
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 px-64 py-20">
      <Toaster position="top-right" reverseOrder={false} />

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Title */}
        <motion.div className="mb-6">
          <h1 className="text-3xl font-bold">User Settings</h1>
        </motion.div>

        {/* Name */}
        <motion.div
          className="p-4 rounded-xl shadow-md bg-white"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <label htmlFor="name" className="text-base font-semibold mb-1 block">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={userData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full p-2 rounded-md bg-gray-100"
          />
        </motion.div>

        {/* Email */}
        <motion.div
          className="p-4 rounded-xl shadow-md bg-white"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <label htmlFor="email" className="text-base font-semibold mb-1 block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-2 rounded-md bg-gray-100"
          />
        </motion.div>

        {/* Bank Information */}
        <motion.div
          className="p-4 rounded-xl shadow-md bg-white space-y-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h2 className="text-lg font-semibold mb-4">Bank Information</h2>

          <div className="space-y-4">
            {/* Account Number */}
            <div>
              <label htmlFor="accountNumber" className="text-base font-semibold mb-1 block">
                Account Number
              </label>
              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                value={userData.accountNumber}
                onChange={handleChange}
                placeholder="Enter your account number"
                className="w-full p-2 rounded-md bg-gray-100"
              />
            </div>

            {/* Account Holder Name */}
            <div>
              <label htmlFor="accountHolderName" className="text-base font-semibold mb-1 block">
                Account Holder Name
              </label>
              <input
                id="accountHolderName"
                name="accountHolderName"
                type="text"
                value={userData.accountHolderName}
                onChange={handleChange}
                placeholder="Enter your Account holder name"
                className="w-full p-2 rounded-md bg-gray-100"
              />
            </div>

            {/* Routing Number */}
            <div>
              <label htmlFor="routingNumber" className="text-base font-semibold mb-1 block">
                Routing Number
              </label>
              <input
                id="routingNumber"
                name="routingNumber"
                type="text"
                value={userData.routingNumber}
                onChange={handleChange}
                placeholder="Enter your Routing Number"
                className="w-full p-2 rounded-md bg-gray-100"
              />
            </div>
          </div>
        </motion.div>

        {/* Save Changes Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-md hover:from-blue-500 hover:to-blue-700"
          >
            Save Changes
          </button>
        </motion.div>

      </form>
    </div>
  );
}
