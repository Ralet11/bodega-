"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react"
import { Button } from "@material-tailwind/react"
import {
  HiOutlineCash,
  HiOutlineDotsVertical,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineIdentification,
  HiOutlineChartBar,
} from "react-icons/hi"
import axios from "axios"
import { getParamsEnv } from "../functions/getParamsEnv"
import { useSelector, useDispatch } from "react-redux"
import { emptyCart, logOutClient } from "../redux/actions/actions"

const { API_URL_BASE } = getParamsEnv()

// Helpers para calcular los totales usando totalSales
// Se calcula el 10% del total de ventas para la bodega
const getTotalBodegaIncome = (shops) =>
  shops.reduce((acc, shop) => acc + shop.totalSales * 0.10, 0)
// El seller se queda con el 5% del 10% de la bodega (0.5% del total)
const getSellerEarnings = (shops) =>
  shops.reduce((acc, shop) => acc + shop.totalSales * 0.10 * 0.05, 0)

// Helper para obtener la fecha de la última orden
const getLastOrder = (orders) => {
  if (!orders || orders.length === 0) return "No orders"
  const latestOrder = orders.reduce((latest, order) => {
    const orderDate = new Date(order.date_time)
    return orderDate > latest ? orderDate : latest
  }, new Date(0))
  return new Date(latestOrder).toLocaleString()
}

const SellersPanel = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [shopsData, setShopsData] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const token = useSelector((state) => state?.client.token)
  const client = useSelector((state) => state?.client.client)
  const totalBodegaIncome = getTotalBodegaIncome(shopsData)
  const totalSellerIncome = getSellerEarnings(shopsData)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Filtrar locales según el término de búsqueda
  const filteredShops = shopsData.filter((shop) =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleLogout = () => {
    dispatch(logOutClient())
    dispatch(emptyCart())
    navigate("/login")
  }

  const handleSettings = () => {
    setIsMenuOpen(false)
    navigate("/sellerSettings")
  }

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await axios.get(
          `${API_URL_BASE}/api/seller/getShops`,
          { headers: { authorization: `Bearer ${token}` } }
        )
        // Asumimos que la respuesta tiene la estructura { shopsData: [...] }
        setShopsData(response.data.shopsData)
        console.log(response.data.shopsData)
      } catch (error) {
        console.log(error)
      }
    }
    fetchShop()
  }, [token])


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
            {/* Menú lateral derecho */}
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 py-6 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* ESTADÍSTICAS SUPERIORES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Seller Code */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-5 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <HiOutlineIdentification className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-500 text-xs sm:text-sm font-medium">
                    Seller Code
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-gray-800 mt-1">
                    {client.referencedCode}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Bodega Income */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-5 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <HiOutlineChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-gray-500 text-xs sm:text-sm font-medium">
                    Total Income (10% Bodega)
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-gray-800 mt-1">
                    ${totalBodegaIncome.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings 5% of 10% */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-5 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <HiOutlineCash className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-gray-500 text-xs sm:text-sm font-medium">
                    Your Earnings (5% of 10% Bodega)
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-gray-800 mt-1">
                    ${totalSellerIncome.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN DE LOCALES */}
          <section className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Your Shops
                  </h1>
                </div>
                {/* Barra de búsqueda */}
                <div className="mt-3 md:mt-0 md:ml-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search shops..."
                      className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent w-full text-sm sm:text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* GRID DE LOCALES */}
            <div className="p-4 sm:p-6">
              {filteredShops.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredShops.map((shop) => {
                    const sellerEarning = shop.totalSales * 0.10 * 0.05
                    const lastOrder = getLastOrder(shop.orders)
                    return (
                      <div
                        key={shop.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="relative">
                          <img
                            src={shop.logo || "/placeholder.svg"}
                            alt={shop.name}
                            className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full uppercase">
                            {shop.status}
                          </div>
                        </div>
                        <div className="p-4 sm:p-5">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                            {shop.name}
                          </h2>
                          <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                            <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                              <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">
                                Bodega Income (10%)
                              </p>
                              <p className="font-bold text-gray-800 text-sm sm:text-base">
                                ${ (shop.totalSales * 0.10).toFixed(2) }
                              </p>
                            </div>
                            <div className="bg-yellow-50 p-2 sm:p-3 rounded-lg">
                              <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">
                                Your 5% (of 10%)
                              </p>
                              <p className="font-bold text-yellow-600 text-sm sm:text-base">
                                ${ sellerEarning.toFixed(2) }
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                            <span>Last order: {lastOrder}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm sm:text-base">
                    No shops found with that name.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto py-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Bodega+. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default SellersPanel
