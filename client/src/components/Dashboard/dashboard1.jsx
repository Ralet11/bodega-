"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { getParamsEnv } from "./../../functions/getParamsEnv"
import { useSelector, useDispatch } from "react-redux"
import { CheckCircle, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ShopsComponent from "./dashShop"
import ProductsComponent from "./dashProducts"
import DashboardSkeleton from "../DashboardSkeleton"
import TutorialCard from "../TutorialCard"
import {
  ComputerDesktopIcon,
  ShoppingCartIcon,
  BellAlertIcon,
  BuildingStorefrontIcon,
  PhoneIcon,
  CogIcon,
  UserIcon,
} from "@heroicons/react/24/solid"
import { setTutorialSeen, setTutorialStep } from "../../redux/actions/actions"

const Dashboard = () => {
  const [shops, setShops] = useState([])
  const [ordersData, setOrdersData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [view, setView] = useState("shops")
  const token = useSelector((state) => state?.client?.token)
  const clientId = useSelector((state) => state?.client?.client?.id)
  const client = useSelector((state) => state?.client?.client)
  const activeShopId = useSelector((state) => state.activeShop)  // <-- ID del shop activo
  const { API_URL_BASE } = getParamsEnv()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Tutorial
  const tutorialStep = useSelector((state) => state.tutorial?.step || 0)
  const tutorialSeen = useSelector((state) => state.tutorial.seen)
  const [showTutorial, setShowTutorial] = useState(!tutorialSeen)
  const totalSteps = 7

  const iconPositions = { /* ...igual que antes...*/ }
  const tutorialSteps = [ /* ...igual que antes...*/ ]

  const [confirmingOwner, setConfirmingOwner] = useState(false)

  const handleNextStep = () => {
    if (tutorialStep < totalSteps - 1) {
      dispatch(setTutorialStep(tutorialStep + 1))
    } else {
      setShowTutorial(false)
      dispatch(setTutorialSeen())
    }
  }

  useEffect(() => {
    if (client?.tutorialComplete) setShowTutorial(false)
  }, [client?.tutorialComplete])

  useEffect(() => {
    if (tutorialSeen) setShowTutorial(false)
  }, [tutorialSeen])

  const handleCloseTutorial = () => {
    setShowTutorial(false)
    dispatch(setTutorialSeen())
  }

  // Fetch
  const fetchShopsAndProducts = async () => {
    try {
      const shopsResponse = await axios.get(
        `${API_URL_BASE}/api/local/byClientId`,
        { headers: { authorization: `Bearer ${token}` }, params: { clients_id: clientId } }
      )
      setShops(shopsResponse.data.locals)

      const ordersResponses = await Promise.all(
        shopsResponse.data.locals.map((shop) =>
          axios.get(`${API_URL_BASE}/api/orders/get/${shop.id}`, {
            headers: { authorization: `Bearer ${token}` },
          })
        )
      )
      const tempOrdersData = {}
      shopsResponse.data.locals.forEach((shop, i) => {
        tempOrdersData[shop.id] = ordersResponses[i].data
      })
      setOrdersData(tempOrdersData)

      const productsResponse = await axios.get(
        `${API_URL_BASE}/api/products/getByClientId/${clientId}`,
        { headers: { authorization: `Bearer ${token}` } }
      )
      setProducts(productsResponse.data)
    } catch (err) {
      console.error("Error fetching data", err)
      setError("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token && clientId) fetchShopsAndProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, clientId])

  // Confirmación owner para el shop activo
  const handleConfirmOwner = async () => {
    const shopToUpdate = shops.find(
      (s) => s.id === activeShopId && !s.owner_check
    )
    if (!shopToUpdate) return

    try {
      setConfirmingOwner(true)
      await axios.put(
        `${API_URL_BASE}/api/local/update/${shopToUpdate.id}`,
        { owner_check: true },
        { headers: { authorization: `Bearer ${token}` } }
      )
      fetchShopsAndProducts()
    } catch (err) {
      console.error("Error confirming owner", err)
    } finally {
      setConfirmingOwner(false)
    }
  }

  if (loading) return <DashboardSkeleton count={5} />
  if (error) return <div className="text-red-500">We still need to verify your information</div>

  // Selecciono solo el shop activo para el onboarding
  const currentShop = shops.find((s) => s.id === activeShopId)
  const anyIncomplete = currentShop
    ? (!currentShop.bankInfo_check || !currentShop.menu_check || !currentShop.owner_check)
    : false

  if (anyIncomplete) {
    const verificationStatus = {
      bankInfo: !!currentShop.bankInfo_check,
      menu:     !!currentShop.menu_check,
      owner:    !!currentShop.owner_check,
    }

    return (
      <div className="relative w-full mx-auto p-3 sm:p-4 max-w-3xl">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Welcome, {client?.name || "User"}
          </h2>
          <h3 className="text-base font-semibold text-gray-800 mt-1">
            Start Operating on Bodega+
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Your store is scheduled to start soon. Please complete the steps below
            to activate your store.
          </p>
        </div>

        {/* Bank Info */}
        <div className="border rounded-lg p-3 bg-white shadow-sm mb-3">
          <div className="flex gap-3">
            <div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  verificationStatus.bankInfo ? "bg-green-100" : "bg-amber-100"
                }`}>
                {verificationStatus.bankInfo
                  ? <CheckCircle className="w-4 h-4 text-green-600" />
                  : <Clock className="w-4 h-4 text-amber-600" />}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  {verificationStatus.bankInfo
                    ? "Bank Information Verified"
                    : "Bank Account Information"}
                </h3>
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    verificationStatus.bankInfo
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                  {verificationStatus.bankInfo ? "Completed" : "In Progress"}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                {verificationStatus.bankInfo
                  ? "Your bank information has been successfully verified."
                  : "We need to verify your bank account to process payments."}
              </p>
              {!verificationStatus.bankInfo && (
                <div className="mt-2 flex gap-2">
                  <button
                    className="px-3 py-1 bg-amber-500 text-white rounded-md"
                    onClick={() => navigate("/clientSettings")}
                  >
                    Update Bank Account
                  </button>
                  <button
                    className="px-3 py-1 border rounded-md"
                    onClick={() => navigate("/support")}
                  >
                    Contact Support
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="border rounded-lg p-3 bg-white shadow-sm mb-3">
          <div className="flex gap-3">
            <div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  verificationStatus.menu ? "bg-green-100" : "bg-blue-100"
                }`}>
                {verificationStatus.menu
                  ? <CheckCircle className="w-4 h-4 text-green-600" />
                  : (
                    <svg className="w-4 h-4 text-blue-600" /* icon SVG */ />
                  )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  {verificationStatus.menu ? "Menu Ready" : "Menu is Being Prepared"}
                </h3>
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    verificationStatus.menu
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                  {verificationStatus.menu ? "Completed" : "In Progress"}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                {verificationStatus.menu
                  ? "Your menu is ready and available for your customers."
                  : "Your menu will be ready soon. We will notify you when it's available."}
              </p>
              <button
                className="mt-2 px-3 py-1 border rounded-md"
                onClick={() => navigate("/settings?tab=appearance")}
              >
                Add Header & Logo
              </button>
            </div>
          </div>
        </div>

        {/* Owner */}
        <div className="border rounded-lg p-3 bg-white shadow-sm">
          <div className="flex gap-3">
            <div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  verificationStatus.owner ? "bg-green-100" : "bg-gray-100"
                }`}>
                {verificationStatus.owner
                  ? <CheckCircle className="w-4 h-4 text-green-600" />
                  : (
                    <svg className="w-4 h-4 text-gray-600" /* icon SVG */ />
                  )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  {verificationStatus.owner
                    ? "Contact Information Verified"
                    : "Confirm Your Email & Phone Number"}
                </h3>
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    verificationStatus.owner
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                  {verificationStatus.owner ? "Completed" : "In Progress"}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                {verificationStatus.owner
                  ? "Your contact information has been verified successfully."
                  : "We will use this information to keep you updated on your orders."}
              </p>
              <p className="text-xs mt-1">
                Email: <span className="font-medium">{client.email}</span>
              </p>
              <p className="text-xs">
                Phone: <span className="font-medium">{client.phone}</span>
              </p>
              {!verificationStatus.owner && (
                <div className="mt-2 flex gap-2">
                  <button
                    className="px-3 py-1 bg-amber-500 text-white rounded-md"
                    onClick={handleConfirmOwner}
                    disabled={confirmingOwner}
                  >
                    {confirmingOwner ? "Confirming..." : "Confirm Information"}
                  </button>
                  <button
                    className="px-3 py-1 border rounded-md"
                    onClick={() => navigate("/settings")}
                  >
                    Update Details
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between mb-1 text-xs">
            <span>Activation Progress</span>
            <span>
              {Object.values(verificationStatus).filter(Boolean).length} of 3
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-amber-500 transition-all"
              style={{
                width: `${
                  (Object.values(verificationStatus).filter(Boolean).length / 3) * 100
                }%`,
              }}
            />
          </div>
        </div>

  
{/*         {showTutorial && (
          <TutorialCard
            step={tutorialStep}
            totalSteps={totalSteps}
            onNextStep={handleNextStep}
            onCloseTutorial={handleCloseTutorial}
            iconPositions={iconPositions}
            tutorialSteps={tutorialSteps}
          />
        )} */}
      </div>
    )
  }

  // Dashboard normal
  return (
    <div className="relative w-full mx-auto sm:p-6">
      <div className="w-full flex flex-col">
        {view === "shops" ? (
          <ShopsComponent shops={shops} ordersData={ordersData} products={products} />
        ) : (
          <ProductsComponent shops={shops} ordersData={ordersData} products={products} />
        )}
      </div>
      {showTutorial && (
        <TutorialCard
          step={tutorialStep}
          totalSteps={totalSteps}
          onNextStep={handleNextStep}
          onCloseTutorial={handleCloseTutorial}
          iconPositions={iconPositions}
          tutorialSteps={tutorialSteps}
        />
      )}
    </div>
  )
}

export default Dashboard
