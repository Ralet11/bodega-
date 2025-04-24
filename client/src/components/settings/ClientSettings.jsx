"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { getParamsEnv } from "../../functions/getParamsEnv"
import { loginSuccess } from "../../redux/actions/actions"
import { resetClient } from "../../functions/ResetClient"
import { User, CreditCard, Lock } from "lucide-react"

const { API_URL_BASE } = getParamsEnv()

export default function ClientSettings() {
  const client = useSelector((state) => state.client.client)
  const token = useSelector((state) => state.client.token)
  const [aux, setAux] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState("profile")

  const [userData, setUserData] = useState({
    name: client.name || "",
    phone: client.phone || "",
    email: client.email || "",
    accountNumber: client.account_number || "",
    accountHolderName: client.account_holder_name || "",
    routingNumber: client.routing_number || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [nameBackup, setNameBackup] = useState("")
  const [emailBackup, setEmailBackup] = useState("")
  const [phoneBackup, setPhoneBackup] = useState("")

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
      name: client.name || "",
      phone: client.phone || "",
      email: client.email || "",
      accountNumber: client.account_number || "",
      accountHolderName: client.account_holder_name || "",
      routingNumber: client.routing_number || "",
    })
  }, [client])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.")
      return
    }

    setLoading(true)

    try {
      await axios.put(`${API_URL_BASE}/api/clients/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success("Password changed successfully.")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setIsPasswordModalOpen(false)
    } catch (error) {
      toast.error("Error changing password.")
      console.error("Error changing password:", error)
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
      toast.success("User data updated successfully.")
    } catch (error) {
      toast.error("Error updating user data.")
      console.error("Error updating user data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Cancel editing functions
  const handleCancelEditName = () => {
    setUserData((prev) => ({ ...prev, name: nameBackup }))
    setIsEditingName(false)
  }

  const handleCancelEditEmail = () => {
    setUserData((prev) => ({ ...prev, email: emailBackup }))
    setIsEditingEmail(false)
  }

  const handleCancelEditPhone = () => {
    setUserData((prev) => ({ ...prev, phone: phoneBackup }))
    setIsEditingPhone(false)
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex -mb-px">
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-b-2 border-amber-500 text-amber-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === "bank"
                    ? "border-b-2 border-amber-500 text-amber-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("bank")}
              >
                Bank Information
              </button>
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === "security"
                    ? "border-b-2 border-amber-500 text-amber-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("security")}
              >
                Security
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-700">Name</h3>
                    </div>
                    {!isEditingName && (
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => {
                          setNameBackup(userData.name)
                          setIsEditingName(true)
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {!isEditingName ? (
                    <div className="pl-7">
                      <p className="text-sm text-gray-700">{userData.name || "No name set"}</p>
                    </div>
                  ) : (
                    <div className="pl-7 flex flex-col gap-2">
                      <input
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          onClick={handleCancelEditName}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="border-b border-gray-200 my-4"></div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <h3 className="text-sm font-medium text-gray-700">Email</h3>
                    </div>
                    {!isEditingEmail && (
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => {
                          setEmailBackup(userData.email)
                          setIsEditingEmail(true)
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {!isEditingEmail ? (
                    <div className="pl-7">
                      <p className="text-sm text-gray-700">{userData.email || "No email set"}</p>
                    </div>
                  ) : (
                    <div className="pl-7 flex flex-col gap-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          onClick={handleCancelEditEmail}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="border-b border-gray-200 my-4"></div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <h3 className="text-sm font-medium text-gray-700">Phone</h3>
                    </div>
                    {!isEditingPhone && (
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => {
                          setPhoneBackup(userData.phone)
                          setIsEditingPhone(true)
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {!isEditingPhone ? (
                    <div className="pl-7">
                      <p className="text-sm text-gray-700">{userData.phone || "No phone set"}</p>
                    </div>
                  ) : (
                    <div className="pl-7 flex flex-col gap-2">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={userData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          onClick={handleCancelEditPhone}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bank Information Tab */}
            {activeTab === "bank" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-medium text-gray-800">Bank Account Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="accountNumber" className="text-sm font-medium text-gray-700 block">
                      Account Number
                    </label>
                    <input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      value={userData.accountNumber}
                      onChange={handleChange}
                      placeholder="Enter your account number"
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="accountHolderName" className="text-sm font-medium text-gray-700 block">
                      Account Holder Name
                    </label>
                    <input
                      id="accountHolderName"
                      name="accountHolderName"
                      type="text"
                      value={userData.accountHolderName}
                      onChange={handleChange}
                      placeholder="Enter account holder name"
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="routingNumber" className="text-sm font-medium text-gray-700 block">
                      Routing Number
                    </label>
                    <input
                      id="routingNumber"
                      name="routingNumber"
                      type="text"
                      value={userData.routingNumber}
                      onChange={handleChange}
                      placeholder="Enter routing number"
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4">
                  <p className="text-sm text-amber-800">
                    Your bank account information is used to process payments for your orders. Make sure all details are
                    correct to avoid payment issues.
                  </p>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-medium text-gray-800">Password & Security</h3>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="text-base font-medium text-gray-700 mb-2">Change Password</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    It's a good idea to use a strong password that you don't use elsewhere
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="sticky bottom-0 bg-white p-4 z-10 rounded-b-2xl shadow-inner"
          >
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md hover:from-amber-600 hover:to-amber-700 transition duration-300 ease-in-out font-medium text-sm shadow-md"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    />
                  </svg>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 block">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 block">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter your new password"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm your new password"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-md hover:bg-amber-600"
              >
                Change Password
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
