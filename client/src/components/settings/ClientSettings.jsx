import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getParamsEnv } from "../../functions/getParamsEnv";
import { loginSuccess } from '../../redux/actions/actions';
import { resetClient } from '../../functions/ResetClient';

const { API_URL_BASE } = getParamsEnv();

export default function ClientSettings() {
  const client = useSelector((state) => state.client.client);
  const token = useSelector((state) => state.client.token);
  const [aux, setAux] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para el loader
  const dispatch = useDispatch();

  // Estado para datos del usuario
  const [userData, setUserData] = useState({
    name: client.name || '',
    phone: client.phone || '',
    email: client.email || '',
    accountNumber: client.account_number || '',
    accountHolderName: client.account_holder_name || '',
    routingNumber: client.routing_number || '',
  });

  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Estado para mostrar/ocultar el modal de cambiar contraseña
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    const resClient = async () => {
      try {
        const clientRes = await resetClient(client.id, token);
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

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setLoading(true); // Activar el loader

    try {
      await axios.put(`${API_URL_BASE}/api/clients/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Password changed successfully.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsPasswordModalOpen(false); // Cerrar el modal tras cambiar la contraseña
    } catch (error) {
      toast.error('Error changing password.');
      console.error('Error changing password:', error);
    } finally {
      setLoading(false); // Desactivar el loader
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true); // Activar el loader

    try {
      // Enviar datos actualizados
      await axios.put(`${API_URL_BASE}/api/clients/update`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAux(!aux);
      toast.success('User data updated successfully.');
    } catch (error) {
      toast.error('Error updating user data.');
      console.error('Error updating user data:', error);
    } finally {
      setLoading(false); // Desactivar el loader
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 px-64 py-20">
      <Toaster position="top-right" reverseOrder={false} />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Loader */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-16 h-16"></div>
          </div>
        )}

        {/* Title */}
        <motion.div className="mb-6">
          <h1 className="text-3xl font-bold">User Settings</h1>
        </motion.div>

        {/* User Information */}
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
            className="w-full p-2 rounded-md bg-gray-100 border border-black"
          />
        </motion.div>

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
            className="w-full p-2 rounded-md bg-gray-100 border border-black"
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
                className="w-full p-2 rounded-md bg-gray-100 border border-black"
              />
            </div>

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
                className="w-full p-2 rounded-md bg-gray-100 border border-black"
              />
            </div>

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
                className="w-full p-2 rounded-md bg-gray-100 border border-black"
              />
            </div>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div
          className="p-4 rounded-xl shadow-md bg-white"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <button
            type="button"
            className="w-full py-2 text-gray-700 text-left rounded-md bg-gray-100 border border-black px-3"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            Change Password
          </button>
        </motion.div>

        {/* Save Changes Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-md hover:from-blue-500 hover:to-blue-700 transition"
          >
            Save Changes
          </button>
        </motion.div>
      </form>

      {/* Modal para cambiar contraseña */}
      {isPasswordModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
          >
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>

            <div>
              <label htmlFor="currentPassword" className="text-base font-semibold mb-1 block">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter your current password"
                className="w-full p-2 rounded-md bg-gray-100 border border-black"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="text-base font-semibold mb-1 block">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter your new password"
                className="w-full p-2 rounded-md bg-gray-100 border border-black"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-base font-semibold mb-1 block">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm your new password"
                className="w-full p-2 rounded-md bg-gray-100 border border-black"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Change Password
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}