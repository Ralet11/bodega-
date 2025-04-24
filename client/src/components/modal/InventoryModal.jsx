"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { getParamsEnv } from "../../functions/getParamsEnv"

const { API_URL_BASE } = getParamsEnv()

function InventoryModal({ show, onClose, token, activeShop }) {
  const [inventoryProducts, setInventoryProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [finalPrice, setFinalPrice] = useState(0)
  const [alwaysActive, setAlwaysActive] = useState(false)
  const [discountSchedule, setDiscountSchedule] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    if (show) {
      fetchInventoryProducts()
      fetchCategories()
    }
  }, [show])

  // 1) Get products without discount
  const fetchInventoryProducts = async () => {
    try {
      const response = await axios.get(`${API_URL_BASE}/api/products/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log(response.data, "response")
      setInventoryProducts(response.data)
    } catch (error) {
      console.error("Error fetching inventory products:", error)
    }
  }

  // Get all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL_BASE}/api/categories/get/${activeShop}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (Array.isArray(response.data)) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  // Calculate finalPrice when discountPercentage changes
  useEffect(() => {
    if (selectedProduct) {
      const basePrice = selectedProduct.price || 0
      const discount = discountPercentage || 0
      const newFinal = basePrice - (basePrice * discount) / 100
      setFinalPrice(Number.parseFloat(newFinal.toFixed(2)))
    }
  }, [discountPercentage, selectedProduct])

  // Handle product selection
  const handleSelectProduct = (product) => {
    setSelectedProduct(product)
    // Reset form fields
    setDiscountPercentage(0)
    setFinalPrice(product.price)
    setAlwaysActive(false)
    setDiscountSchedule([])
    setSelectedCategory(product.categories_id || null)
  }

  // Add a new time interval to discountSchedule
  const handleAddSchedule = () => {
    setDiscountSchedule([...discountSchedule, { start: "", end: "" }])
  }

  // Handle interval change
  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...discountSchedule]
    updatedSchedule[index][field] = value
    setDiscountSchedule(updatedSchedule)
  }

  // Delete a time interval
  const handleDeleteSchedule = (index) => {
    const updatedSchedule = [...discountSchedule]
    updatedSchedule.splice(index, 1)
    setDiscountSchedule(updatedSchedule)
  }

  // Convert 24h time format to 12h AM/PM
  const formatTimeTo12Hour = (time24) => {
    if (!time24) return ""

    const [hours, minutes] = time24.split(":")
    let period = "AM"
    let hours12 = Number.parseInt(hours, 10)

    if (hours12 >= 12) {
      period = "PM"
      if (hours12 > 12) {
        hours12 -= 12
      }
    }

    if (hours12 === 0) {
      hours12 = 12
    }

    return `${hours12.toString().padStart(2, "0")}:${minutes} ${period}`
  }

  // Convert 12h AM/PM time to 24h format for storage
  const formatTimeTo24Hour = (time12) => {
    if (!time12) return ""

    const [timePart, period] = time12.split(" ")
    const [hours, minutes] = timePart.split(":")
    let hours24 = Number.parseInt(hours, 10)

    if (period === "PM" && hours24 < 12) {
      hours24 += 12
    } else if (period === "AM" && hours24 === 12) {
      hours24 = 0
    }

    return `${hours24.toString().padStart(2, "0")}:${minutes}`
  }

  // 2) Update product (pushInventoryProduct)
  const handlePushInventory = async () => {
    if (!selectedProduct) return

    try {
      const body = {
        discountPercentage,
        finalPrice,
        AlwaysActive: alwaysActive,
        discountSchedule: alwaysActive ? null : discountSchedule,
        categories_id: selectedCategory, // new category
      }

      await axios.put(`${API_URL_BASE}/api/products/inventory/${selectedProduct.id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Refresh the list of products without discount
      fetchInventoryProducts()
      // Clear selection
      setSelectedProduct(null)
      setDiscountPercentage(0)
      setFinalPrice(0)
      setAlwaysActive(false)
      setDiscountSchedule([])
      alert("Product updated successfully!")
    } catch (error) {
      console.error("Error pushing inventory product:", error)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Inventory Management</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row">
          {/* Left column - Products list */}
          <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <svg
                className="absolute right-3 top-2.5 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>

            <h3 className="font-medium text-gray-700 mb-3">Available Products</h3>
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {inventoryProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No products available</div>
              ) : (
                inventoryProducts
                  .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((product) => (
                    <div
                      key={product.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                        selectedProduct?.id === product.id
                          ? "bg-amber-50 border-amber-500"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                      onClick={() => handleSelectProduct(product)}
                    >
                      <div className="flex gap-3">
                        {/* Product image */}
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 border">
                          {product.img ? (
                            <img
                              src={product.img || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-semibold text-gray-800">{product.name}</p>
                            <span className="font-medium text-amber-600">${product.price}</span>
                          </div>
                          {product.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Right column - Discount form */}
          <div className="w-full md:w-1/2 p-6 bg-gray-50">
            {selectedProduct ? (
              <>
                <div className="mb-5 pb-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-1">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600">
                    Original price: <span className="font-medium">${selectedProduct.price}</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                      />
                      <span className="absolute right-3 top-2 text-gray-500">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Final Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        value={finalPrice}
                        onChange={(e) => setFinalPrice(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 italic">Calculated as: price - (price × discount ÷ 100)</p>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          id="alwaysActive"
                          type="checkbox"
                          className="sr-only"
                          checked={alwaysActive}
                          onChange={(e) => setAlwaysActive(e.target.checked)}
                        />
                        <div
                          className={`w-10 h-5 bg-gray-300 rounded-full shadow-inner ${alwaysActive ? "bg-amber-500" : ""}`}
                        ></div>
                        <div
                          className={`absolute w-4 h-4 bg-white rounded-full shadow top-0.5 left-0.5 transition ${alwaysActive ? "transform translate-x-5" : ""}`}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700">Always Active (24 hours)</span>
                    </label>
                  </div>

                  {!alwaysActive && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discount Schedule</label>
                      <div className="space-y-2 mb-2">
                        {discountSchedule.map((interval, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="time"
                              value={interval.start}
                              onChange={(e) => handleScheduleChange(idx, "start", e.target.value)}
                              className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              value={interval.end}
                              onChange={(e) => handleScheduleChange(idx, "end", e.target.value)}
                              className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                            <button
                              className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                              onClick={() => handleDeleteSchedule(idx)}
                              title="Delete interval"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700 font-medium"
                        onClick={handleAddSchedule}
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          ></path>
                        </svg>
                        Add Interval
                      </button>
                    </div>
                  )}

                  {/* Category selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: `right 0.5rem center`,
                        backgroundRepeat: `no-repeat`,
                        backgroundSize: `1.5em 1.5em`,
                        paddingRight: `2.5rem`,
                      }}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handlePushInventory}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium py-2.5 px-4 rounded-lg hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 text-gray-500">
                <svg
                  className="w-16 h-16 mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
                <p className="text-center">Select a product from the list to configure its discount</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryModal
