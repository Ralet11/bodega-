'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { getParamsEnv } from "../../functions/getParamsEnv"
import { loginSuccess } from '../../redux/actions/actions'
import { resetClient } from '../../functions/ResetClient'

const { API_URL_BASE } = getParamsEnv()

export default function ClientSettings() {
  const client = useSelector((state) => state.client.client)
  const token = useSelector((state) => state.client.token)
  const [aux, setAux] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const [userData, setUserData] = useState({
    name: client.name || '',
    phone: client.phone || '',
    email: client.email || '',
    accountNumber: client.account_number || '',
    accountHolderName: client.account_holder_name || '',
    routingNumber: client.routing_number || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  useEffect(() => {
    const resClient = async () => {
      try {
        const clientRes = await resetClient(client.id, token)
        dispatch(loginSuccess(clientRes.client))
      } catch (error) {
        console.log(error)
      }
    }
    if (token) {
      resClient()
    }
  }, [dispatch, client.id, token, aux])

  useEffect(() => {
    setUserData({
      name: client.name || '',
      phone: client.phone || '',
      email: client.email || '',
      accountNumber: client.account_number || '',
      accountHolderName: client.account_holder_name || '',
      routingNumber: client.routing_number || '',
    })
  }, [client])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await axios.put(`${API_URL_BASE}/api/clients/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success('Password changed successfully.')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setIsPasswordModalOpen(false)
    } catch (error) {
      toast.error('Error changing password.')
      console.error('Error changing password:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)

    try {
      await axios.put(`${API_URL_BASE}/api/clients/update`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setAux(!aux)
      toast.success('User data updated successfully.')
    } catch (error) {
      toast.error('Error updating user data.')
      console.error('Error updating user data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-12 lg:p-20">
      <Toaster position="top-right" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden" // Cambiado a max-w-4xl
      >
        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">User Settings</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {loading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
              </div>
            )}

            <div className="space-y-6">
              <InputField
                label="Name"
                id="name"
                name="name"
                type="text"
                value={userData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />

              <InputField
                label="Email"
                id="email"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />

              {/* Fondo de Bank Information igualado */}
              <div className="bg-white p-6 rounded-xl border border-gray-200"> 
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bank Information</h2>
                <div className="space-y-4">
                  <InputField
                    label="Account Number"
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    value={userData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter your account number"
                  />

                  <InputField
                    label="Account Holder Name"
                    id="accountHolderName"
                    name="accountHolderName"
                    type="text"
                    value={userData.accountHolderName}
                    onChange={handleChange}
                    placeholder="Enter your Account holder name"
                  />

                  <InputField
                    label="Routing Number"
                    id="routingNumber"
                    name="routingNumber"
                    type="text"
                    value={userData.routingNumber}
                    onChange={handleChange}
                    placeholder="Enter your Routing Number"
                  />
                </div>
              </div>

              <motion.button
                type="button"
                className="w-full py-3 text-gray-700 text-left rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-300 ease-in-out px-4 font-medium"
                onClick={() => setIsPasswordModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Change Password
              </motion.button>

              <motion.button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save Changes
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {isPasswordModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>

            <div className="space-y-4">
              <InputField
                label="Current Password"
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter your current password"
              />

              <InputField
                label="New Password"
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter your new password"
              />

              <InputField
                label="Confirm New Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm your new password"
              />
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <motion.button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-6 py-2 bg-gray-200 rounded-lg text-gray-800 font-medium hover:bg-gray-300 transition duration-300 ease-in-out"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={handlePasswordChange}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-300 ease-in-out"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Change Password
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

function InputField({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
      </label>
      <input
        id={id}
        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ease-in-out"
        {...props}
      />
    </div>
  )
}
