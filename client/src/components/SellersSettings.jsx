"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button
} from "@material-tailwind/react"
import {
  HiOutlineDotsVertical,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineHome,
} from "react-icons/hi"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { getParamsEnv } from "../functions/getParamsEnv"
import { logOutClient, emptyCart, loginSuccess } from "../redux/actions/actions"
import { resetClient } from "../functions/ResetClient"

// List of countries for the dropdown
const countryOptions = [
  { code: 'US', name: 'United States' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ES', name: 'Spain' },
  { code: 'CA', name: 'Canada' },
  // Add more countries as needed
]

const { API_URL_BASE } = getParamsEnv()

const SellerSettings = () => {
  const client = useSelector((state) => state?.client.client)
  const token = useSelector((state) => state?.client.token)
  const [email, setEmail] = useState(client?.email || "")
  const [ssn, setSSN] = useState(client?.ssn || "")
  const [idNumber, setIdNumber] = useState(client?.idNumber || "")

  // New states for account fields
  const [accountNumber, setAccountNumber] = useState(client?.account_number || "")
  const [accountHolderName, setAccountHolderName] = useState(client?.account_holder_name || "")
  const [routingNumber, setRoutingNumber] = useState(client?.routing_number || "")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // For Stripe Connect inline form
  const [showStripeForm, setShowStripeForm] = useState(false)
  const [stripeEmail, setStripeEmail] = useState(client?.email || "")
  const [stripeBusinessName, setStripeBusinessName] = useState("")
  const [stripeCountry, setStripeCountry] = useState("US")
  const [stripeError, setStripeError] = useState("")
  const [stripeLoading, setStripeLoading] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Fetch additional seller data (example)
  const fetchSellerData = async () => {
    try {
      const response = await axios.get(`${API_URL_BASE}/api/clients/sett/idssn`, {
        headers: { authorization: `Bearer ${token}` }
      })
      if (response.data) {
        setSSN(response.data.ssn || ssn)
        setIdNumber(response.data.idNumber || idNumber)
      }
    } catch (error) {
      console.error("Error fetching seller data:", error)
    }
  }

  useEffect(() => {
    if (token) {
      fetchSellerData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Update client data when it changes
  useEffect(() => {
    setEmail(client?.email || "")
    setAccountNumber(client?.account_number || "")
    setAccountHolderName(client?.account_holder_name || "")
    setRoutingNumber(client?.routing_number || "")
  }, [client])

  // Handle submit for personal data
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required.")
      return
    }
    setError("")
    setSuccess("")

    try {
      const payload = { 
        email,
        account_number: accountNumber,
        account_holder_name: accountHolderName,
        routing_number: routingNumber
      }
      await axios.put(`${API_URL_BASE}/api/clients/update`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const { client: updatedClient } = await resetClient(client?.id, token)
      dispatch(loginSuccess(updatedClient))

      setSuccess("Data updated successfully.")
    } catch (err) {
      console.error(err)
      setError("Error updating data. Please try again.")
    }
  }

  // Logout
  const handleLogout = () => {
    dispatch(logOutClient())
    dispatch(emptyCart())
    navigate("/login")
  }

  const handleSettings = () => {
    setIsMenuOpen(false)
  }

  const handleHome = () => {
    setIsMenuOpen(false)
    navigate("/sellersPanel")
  }

  // Handle submit for creating Stripe Connect account
  const handleStripeSubmit = async (e) => {
    e.preventDefault()
    setStripeError("")
    setStripeLoading(true)
    try {
      const payload = {
        email: stripeEmail,
        business_name: stripeBusinessName,
        country: stripeCountry
      }
      const response = await axios.post(
        `${API_URL_BASE}/api/seller/stripe/create-connected-account`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data && response.data.url) {
        window.location.href = response.data.url
      } else {
        setStripeError("Stripe URL not received.")
      }
    } catch (error) {
      console.error("Error creating Stripe account:", error)
      setStripeError("Error creating Stripe account. Please try again.")
    }
    setStripeLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/sellersPanel" className="flex-shrink-0">
                <img
                  className="h-10 w-auto rounded-full shadow-md transition-transform duration-300 hover:scale-110"
                  src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1726357397/logo_oe3idx.jpg"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-4">
              <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
                <MenuHandler>
                  <Button
                    className="flex items-center bg-transparent text-black hover:bg-black/10 px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-none"
                    variant="text"
                  >
                    <HiOutlineDotsVertical className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                  </Button>
                </MenuHandler>
                <MenuList className="p-2 border border-gray-200 shadow-lg">
                  <MenuItem
                    onClick={handleHome}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                  >
                    <HiOutlineHome className="h-5 w-5 text-black" />
                    <span>Home</span>
                  </MenuItem>
                  <MenuItem
                    onClick={handleSettings}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                  >
                    <HiOutlineUser className="h-5 w-5 text-black" />
                    <span>Settings</span>
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded text-red-500"
                  >
                    <HiOutlineLogout className="h-5 w-5" />
                    <span>Logout</span>
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* PERSONAL DATA SECTION */}
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Personal Data</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            {/* SSN */}
            <div className="flex flex-col">
              <label htmlFor="ssn" className="text-gray-700 font-medium mb-1">
                Social Security Number
              </label>
              <input
                type="text"
                id="ssn"
                value={ssn}
                readOnly
                maxLength={9}
                placeholder="9 digits"
                className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed focus:outline-none"
              />
            </div>
            {/* ID Number */}
            <div className="flex flex-col">
              <label htmlFor="idNumber" className="text-gray-700 font-medium mb-1">
                Identification Number
              </label>
              <input
                type="text"
                id="idNumber"
                value={idNumber}
                readOnly
                className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed focus:outline-none"
              />
            </div>
            {/* Account Number */}
            <div className="flex flex-col">
              <label htmlFor="accountNumber" className="text-gray-700 font-medium mb-1">
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            {/* Account Holder Name */}
            <div className="flex flex-col">
              <label htmlFor="accountHolderName" className="text-gray-700 font-medium mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                id="accountHolderName"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Enter account holder name"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            {/* Routing Number */}
            <div className="flex flex-col">
              <label htmlFor="routingNumber" className="text-gray-700 font-medium mb-1">
                Routing Number
              </label>
              <input
                type="text"
                id="routingNumber"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                placeholder="Enter routing number"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            {/* Save Changes Button */}
            <div className="md:col-span-2 flex justify-end mt-2">
              <Button type="submit" color="amber" ripple="light">
                Save Changes
              </Button>
            </div>
          </form>
      
          {/* <div className="flex justify-center mt-6">
            <Button
              onClick={() => setShowStripeForm(true)}
              className="bg-[#635bff] text-white hover:bg-[#544eea] px-4 py-2 rounded-md"
            >
              Create Stripe Connect Account
            </Button>
          </div> */}
        </div>

        {/* STRIPE CONNECT FORM (INLINE) */}
        {showStripeForm && (
          <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded-md">
            {/* Header area */}
            <div className="bg-[#635bff] text-white p-4 rounded-t-md">
              <h3 className="text-lg font-bold">Create Stripe Connect Account</h3>
            </div>
            {/* Form */}
            <form onSubmit={handleStripeSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {stripeError && (
                <div className="md:col-span-2">
                  <p className="text-red-500 mb-4">{stripeError}</p>
                </div>
              )}
              <div className="flex flex-col">
                <label htmlFor="stripeEmail" className="text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  id="stripeEmail"
                  type="email"
                  value={stripeEmail}
                  onChange={(e) => setStripeEmail(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="stripeBusinessName" className="text-gray-700 font-medium mb-1">
                  Business Name
                </label>
                <input
                  id="stripeBusinessName"
                  type="text"
                  value={stripeBusinessName}
                  onChange={(e) => setStripeBusinessName(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="stripeCountry" className="text-gray-700 font-medium mb-1">
                  Country
                </label>
                <select
                  id="stripeCountry"
                  value={stripeCountry}
                  onChange={(e) => setStripeCountry(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded"
                  required
                >
                  {countryOptions.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end mt-2">
                <Button
                  type="button"
                  variant="text"
                  color="red"
                  onClick={() => setShowStripeForm(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={stripeLoading}
                  className="bg-[#635bff] text-white hover:bg-[#544eea]"
                >
                  {stripeLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-4 bg-white border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Bodega+. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default SellerSettings
