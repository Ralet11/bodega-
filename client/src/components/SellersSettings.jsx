"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react"
import { Button } from "@material-tailwind/react"
import {
  HiOutlineDotsVertical,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineHome,
} from "react-icons/hi"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { getParamsEnv } from "../functions/getParamsEnv"
import { logOutClient, emptyCart } from "../redux/actions/actions"

const { API_URL_BASE } = getParamsEnv()

const SellerSettings = () => {
  const client = useSelector((state) => state?.client.client)
  const token = useSelector((state) => state?.client.token)
  const [email, setEmail] = useState(client?.email || "")
  const [ssn, setSSN] = useState(client?.ssn || "")
  const [idNumber, setIdNumber] = useState(client?.idNumber || "")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Function to fetch seller data (ssn and idNumber)
  const fetchSellerData = async () => {
    try {
      const response = await axios.get(
        `${API_URL_BASE}/api/clients/sett/idssn`,
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      if (response.data) {
        setSSN(response.data.ssn || ssn)
        setIdNumber(response.data.idNumber || idNumber)
      }
    } catch (error) {
      console.error("Error fetching seller data:", error)
    }
  }

  // Call fetchSellerData when the token is available
  useEffect(() => {
    if (token) {
      fetchSellerData()
    }
  }, [token])

  // Update the email if the client changes (optional)
  useEffect(() => {
    setEmail(client?.email || "")
  }, [client])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Only the email field is editable, so we validate that it is provided
    if (!email) {
      setError("Email is required.")
      return
    }
    setError("")
    try {
      const payload = { email }
      await axios.put(
        `${API_URL_BASE}/api/seller/updateProfile`,
        payload,
        {
          headers: {
            authorization: `Bearer ${client?.token}`
          }
        }
      )
      setSuccess("Data updated successfully.")
    } catch (err) {
      console.error(err)
      setError("Error updating data. Please try again.")
    }
  }

  const handleLogout = () => {
    dispatch(logOutClient())
    dispatch(emptyCart())
    navigate("/login")
  }

  // Since we're already on Settings, just close the menu
  const handleSettings = () => {
    setIsMenuOpen(false)
  }

  // On selecting "Home", close the menu and navigate to the sellers panel
  const handleHome = () => {
    setIsMenuOpen(false)
    navigate("/sellersPanel")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
                  <MenuItem onClick={handleHome} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                    <HiOutlineHome className="h-5 w-5 text-black" />
                    <span>Home</span>
                  </MenuItem>
                  <MenuItem onClick={handleSettings} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                    <HiOutlineUser className="h-5 w-5 text-black" />
                    <span>Settings</span>
                  </MenuItem>
                  <MenuItem onClick={handleLogout} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded text-red-500">
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
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Personal Data</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="ssn" className="block text-gray-700 font-medium mb-2">
                Social Security Number
              </label>
              <input
                type="text"
                id="ssn"
                value={ssn}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed focus:outline-none"
                maxLength={9}
                placeholder="9 digits"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="idNumber" className="block text-gray-700 font-medium mb-2">
                Identification Number
              </label>
              <input
                type="text"
                id="idNumber"
                value={idNumber}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" color="amber" ripple="light">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
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
