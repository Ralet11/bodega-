"use client"

import { useState, useEffect, useRef, Fragment } from "react"
import axios from "axios"
import {
  ChevronLeft,
  ChevronDown,
  Check,
  Lock,
  ArrowRight,
  Plus,
  Minus,
  Search,
  X,
  Phone,
  Mail,
  Bell,
  Clock,
  Info,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { getParamsEnv } from "../functions/getParamsEnv"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { changeShop } from "../redux/actions/actions"

const { API_URL_BASE } = getParamsEnv()

const StoreConfiguration = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [screen, setScreen] = useState("storeInfo")
  const [screenCompleted, setScreenCompleted] = useState({
    storeInfo: false,
    order: false,
    hours: false,
    menu: false,
    account: false,
  })
  const [storeInfo, setStoreInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    selectedTags: [],
  })
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 })
  const [availableTags, setAvailableTags] = useState([])
  const token = useSelector((state) => state?.client.token)

  useEffect(() => {
    axios
      .get(`${API_URL_BASE}/api/tags/getAll`)
      .then(({ data }) => setAvailableTags(data.data ?? []))
      .catch(() => toast.error("Error fetching tags"))
  }, [])

  const handleStoreInfoChange = (field, value) =>
    setStoreInfo((prev) => ({ ...prev, [field]: value }))

  const toggleTag = (tag) =>
    setStoreInfo((prev) => {
      const exists = prev.selectedTags.some((t) => t.id === tag.id)
      return {
        ...prev,
        selectedTags: exists ? prev.selectedTags.filter((t) => t.id !== tag.id) : [...prev.selectedTags, tag],
      }
    })

  const autocompleteRef = useRef(null)
  const addressInputRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.maps && addressInputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(addressInputRef.current, { types: ["address"] })
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace()
        if (place?.formatted_address) {
          handleStoreInfoChange("address", place.formatted_address)
          if (place.geometry?.location) {
            setCoordinates({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            })
          }
        }
      })
    }
  }, [screen === "storeInfo"])

  const [orderMethod, setOrderMethod] = useState("")
  const availableHours = [
    "08:00 a.m.","09:00 a.m.","10:00 a.m.","11:00 a.m.","12:00 p.m.","01:00 p.m.","02:00 p.m.",
    "03:00 p.m.","04:00 p.m.","05:00 p.m.","06:00 p.m.","07:00 p.m.","08:00 p.m.","09:00 p.m.","10:00 p.m.",
  ]
  const initialDays = [
    { day: "Monday", slots: [{ open: "08:00 a.m.", close: "10:00 p.m." }], closed: false },
    { day: "Tuesday", slots: [{ open: "08:00 a.m.", close: "10:00 p.m." }], closed: false },
    { day: "Wednesday", slots: [{ open: "08:00 a.m.", close: "10:00 p.m." }], closed: false },
    { day: "Thursday", slots: [{ open: "08:00 a.m.", close: "10:00 p.m." }], closed: false },
    { day: "Friday", slots: [{ open: "08:00 a.m.", close: "10:00 p.m." }], closed: false },
    { day: "Saturday", slots: [{ open: "08:00 a.m.", close: "10:00 p.m." }], closed: false },
    { day: "Sunday", slots: [{ open: "08:00 a.m.", close: "10:00 p.m." }], closed: false },
  ]
  const [daysOfWeek, setDaysOfWeek] = useState(initialDays)
  const [applySameSchedule, setApplySameSchedule] = useState(true)
  const [generalSchedule, setGeneralSchedule] = useState([{ open: "08:00 a.m.", close: "10:00 p.m." }])

  const handleToggleSameSchedule = () => {
    setApplySameSchedule((prev) => !prev)
    if (!applySameSchedule) {
      setDaysOfWeek((prev) => prev.map((d) => ({ ...d, slots: [...generalSchedule] })))
    }
  }
  const handleGeneralSlotChange = (i, f, v) =>
    setGeneralSchedule((prev) => prev.map((s, idx) => (idx === i ? { ...s, [f]: v } : s)))
  const addGeneralSlot = () => setGeneralSchedule((prev) => [...prev, { open: "08:00 a.m.", close: "10:00 p.m." }])
  const removeGeneralSlot = (i) => setGeneralSchedule((prev) => prev.filter((_, idx) => idx !== i))

  const handleSlotChange = (dIdx, sIdx, f, v) =>
    setDaysOfWeek((prev) =>
      prev.map((d, idx) =>
        idx === dIdx ? { ...d, slots: d.slots.map((s, j) => (j === sIdx ? { ...s, [f]: v } : s)) } : d,
      ),
    )
  const addSlot = (dIdx) =>
    setDaysOfWeek((prev) =>
      prev.map((d, idx) =>
        idx === dIdx ? { ...d, slots: [...d.slots, { open: "08:00 a.m.", close: "10:00 p.m." }] } : d,
      ),
    )
  const removeSlot = (dIdx, sIdx) =>
    setDaysOfWeek((prev) =>
      prev.map((d, idx) =>
        idx === dIdx ? { ...d, slots: d.slots.filter((_, j) => j !== sIdx) } : d,
      ),
    )
  const handleClosedChange = (dIdx) =>
    setDaysOfWeek((prev) => prev.map((d, idx) => (idx === dIdx ? { ...d, closed: !d.closed } : d)))

  const [menuOption, setMenuOption] = useState("link")
  const [menuLink, setMenuLink] = useState("")
  const [menuFile, setMenuFile] = useState(null)
  const [bankAccount, setBankAccount] = useState({
    routingNumber: "",
    accountNumber: "",
    legalName: "name 1",
    restaurantType: "Physical",
    branches: "",
    taxId: "",
  })
  const handleBankAccountChange = (field, value) =>
    setBankAccount((prev) => ({ ...prev, [field]: value }))

  useEffect(() => verifyScreenCompleted(), [
    storeInfo,
    orderMethod,
    daysOfWeek,
    generalSchedule,
    applySameSchedule,
    menuLink,
    menuFile,
    bankAccount,
  ])

  const verifyScreenCompleted = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setScreenCompleted({
      storeInfo:
        storeInfo.name && storeInfo.address && storeInfo.phone && emailRegex.test(storeInfo.email) && storeInfo.selectedTags.length,
      order: orderMethod !== "",
      hours: applySameSchedule
        ? generalSchedule.every((s) => s.open && s.close)
        : daysOfWeek.some((d) => !d.closed && d.slots.some((s) => s.open && s.close)),
      menu: menuOption === "link" ? menuLink.trim() : !!menuFile,
      account:
        bankAccount.routingNumber.length === 9 &&
        bankAccount.accountNumber.length >= 5 &&
        bankAccount.legalName &&
        bankAccount.branches,
    })
  }

  const submitShop = async (payload) => {
    /*  
       DEVUELVE la respuesta del backend --
       de lo contrario  .then(({data})=>…) recibe undefined.
    */
    if (menuOption === "upload") {
      const form = new FormData()
      form.append("file", menuFile)
      form.append("data", JSON.stringify(payload))
  
      const { data } = await axios.post(`${API_URL_BASE}/api/local/add`, form, {
        headers: { authorization: `Bearer ${token}` },
      })
      return data
    } else {
      const { data } = await axios.post(`${API_URL_BASE}/api/local/add`, payload, {
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
      })
      return data
    }
  }
  

  const advanceScreen = () => {
    switch (screen) {
      case "storeInfo":
        setScreen("order")
        break
      case "order":
        setScreen("hours")
        break
      case "hours":
        setScreen("menu")
        break
      case "menu":
        setScreen("account")
        break
      case "account": {
        const payload = {
          storeInfo,
          orderMethod,
          coordinates,
          hours: applySameSchedule ? { generalSchedule } : { daysOfWeek },
          bankAccount,
          menu: { menuOption, menuLink },
        }
  
        submitShop(payload)
          .then((data) => {
            /* ✅ guardar en Redux y navegar */
            dispatch(changeShop(data.result.id))
            toast.success("Configuration completed successfully")
            navigate("/dashboard")
          })
          .catch((err) =>
            toast.error(err.response?.data?.message ?? "Error completing configuration"),
          )
        break
      }
      default:
        break
    }
  }

  const goBackScreen = () => {
    const map = { order: "storeInfo", hours: "order", menu: "hours", account: "menu" }
    if (map[screen]) setScreen(map[screen])
  }

  const getWelcomeMessage = () => {
    switch (screen) {
      case "storeInfo":
        return {
          title: "Welcome to BODEGA+",
          message: "Let's start by setting up your store information.",
        }
      case "order":
        return {
          title: "Order Notification Setup",
          message: "Configure how you'll be notified when customers place orders.",
        }
      case "hours":
        return {
          title: "Business Hours",
          message: "Set your operating hours so customers know when they can place orders.",
        }
      case "menu":
        return {
          title: "Menu Configuration",
          message: "Add your menu.",
        }
      case "account":
        return {
          title: "Payment Information",
          message: "Set up your bank account details to receive payments.",
        }
      default:
        return { title: "", message: "" }
    }
  }

  const welcomeMessage = getWelcomeMessage()

  const renderContent = () => {
    switch (screen) {
      case "storeInfo":
        return (
          <>
            <div className="bg-gray-100 rounded-lg p-4 mb-6 border-l-4 border-amber-500">
              <h2 className="text-lg font-semibold text-amber-700">{welcomeMessage.title}</h2>
              <p className="text-gray-600">{welcomeMessage.message}</p>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Information</h1>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={storeInfo.name}
                  onChange={(e) => handleStoreInfoChange("name", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="relative">
                  <input
                    ref={addressInputRef}
                    type="text"
                    value={storeInfo.address}
                    onChange={(e) => handleStoreInfoChange("address", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md pl-10 focus:border-amber-500"
                  />
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
                <input
                  type="tel"
                  value={storeInfo.phone}
                  onChange={(e) => handleStoreInfoChange("phone", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={storeInfo.email}
                  onChange={(e) => handleStoreInfoChange("email", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {storeInfo.selectedTags.map((tag) => (
                    <div key={tag.id} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center">
                      {tag.emoji} {tag.name}
                      <button onClick={() => toggleTag(tag)} className="ml-2 text-amber-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {availableTags
                      .filter((tag) => !storeInfo.selectedTags.some((t) => t.id === tag.id))
                      .map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag)}
                          className="text-left px-3 py-2 hover:bg-gray-200 rounded-md"
                        >
                          {tag.emoji} {tag.name}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button
                className={`flex items-center px-6 py-2 rounded-md ${
                  screenCompleted.storeInfo ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"
                }`}
                onClick={advanceScreen}
                disabled={!screenCompleted.storeInfo}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </>
        )
      case "order":
        return (
          <>
            <div className="bg-gray-100 rounded-lg p-4 mb-6 border-l-4 border-amber-500">
              <h2 className="text-lg font-semibold text-amber-700">{welcomeMessage.title}</h2>
              <p className="text-gray-600">{welcomeMessage.message}</p>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Notification Method</h1>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start">
              <Info className="text-blue-500 w-5 h-5 mr-2 mt-0.5" />
              <p className="text-sm text-blue-700">Choose how you will receive new order alerts.</p>
            </div>
            <div
              className={`border rounded-lg p-6 cursor-pointer ${
                orderMethod === "phone_email" ? "border-amber-500 bg-amber-50 shadow-md" : "border-gray-200"
              }`}
              onClick={() => setOrderMethod("phone_email")}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <Bell className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-medium">Phone Call + Email Notification</h3>
                </div>
                {orderMethod === "phone_email" && (
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="pl-16">
                <p className="text-gray-700 mb-4">You'll receive notifications through two channels:</p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <Phone className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Phone Call</p>
                      <p className="text-gray-600 text-sm">Automated call for new orders</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <Mail className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-gray-600 text-sm">Detailed order email</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Response time:</span> acknowledge within 5 minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button
                className={`flex items-center px-6 py-2 rounded-md ${
                  screenCompleted.order ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"
                }`}
                onClick={advanceScreen}
                disabled={!screenCompleted.order}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </>
        )
      case "hours":
        return (
          <>
            <div className="bg-gray-100 rounded-lg p-4 mb-6 border-l-4 border-amber-500">
              <h2 className="text-lg font-semibold text-amber-700">{welcomeMessage.title}</h2>
              <p className="text-gray-600">{welcomeMessage.message}</p>
            </div>
            <div className="flex items-center mb-6">
              <div
                className={`w-12 h-6 rounded-full p-1 ${applySameSchedule ? "bg-amber-500" : "bg-gray-200"} mr-3 cursor-pointer`}
                onClick={handleToggleSameSchedule}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                    applySameSchedule ? "translate-x-6" : ""
                  }`}
                ></div>
              </div>
              <span className="text-gray-700">Apply the same schedule for all days</span>
            </div>
            {applySameSchedule ? (
              <div className="space-y-4 mt-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">General schedule for the store</h1>
                {generalSchedule.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="relative w-40">
                      <select
                        className="appearance-none w-full border border-gray-300 rounded-md py-2 px-3"
                        value={slot.open}
                        onChange={(e) => handleGeneralSlotChange(index, "open", e.target.value)}
                      >
                        {availableHours.map((hour) => (
                          <option key={`general-open-${hour}`} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span>-</span>
                    <div className="relative w-40">
                      <select
                        className="appearance-none w-full border border-gray-300 rounded-md py-2 px-3"
                        value={slot.close}
                        onChange={(e) => handleGeneralSlotChange(index, "close", e.target.value)}
                      >
                        {availableHours.map((hour) => (
                          <option key={`general-close-${hour}`} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button onClick={addGeneralSlot} className="p-2 text-amber-500 rounded-full">
                      <Plus className="w-5 h-5" />
                    </button>
                    {generalSchedule.length > 1 && (
                      <button onClick={() => removeGeneralSlot(index)} className="p-2 text-red-500 rounded-full">
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Configure schedule by day</h1>
                {daysOfWeek.map((day, dayIndex) => (
                  <div key={day.day} className="border p-4 rounded-md mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-lg font-medium">{day.day}</div>
                      <div>
                        <label className="text-sm text-gray-700 mr-2">Closed</label>
                        <input type="checkbox" checked={day.closed} onChange={() => handleClosedChange(dayIndex)} />
                      </div>
                    </div>
                    {!day.closed && (
                      <div className="space-y-2">
                        {day.slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex items-center space-x-4">
                            <div className="relative w-40">
                              <select
                                className="appearance-none w-full border border-gray-300 rounded-md py-2 px-3"
                                value={slot.open}
                                onChange={(e) => handleSlotChange(dayIndex, slotIndex, "open", e.target.value)}
                              >
                                {availableHours.map((hour) => (
                                  <option key={`${day.day}-open-${hour}`} value={hour}>
                                    {hour}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <span>-</span>
                            <div className="relative w-40">
                              <select
                                className="appearance-none w-full border border-gray-300 rounded-md py-2 px-3"
                                value={slot.close}
                                onChange={(e) => handleSlotChange(dayIndex, slotIndex, "close", e.target.value)}
                              >
                                {availableHours.map((hour) => (
                                  <option key={`${day.day}-close-${hour}`} value={hour}>
                                    {hour}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button onClick={() => addSlot(dayIndex)} className="p-2 text-amber-500 rounded-full">
                              <Plus className="w-5 h-5" />
                            </button>
                            {day.slots.length > 1 && (
                              <button
                                onClick={() => removeSlot(dayIndex, slotIndex)}
                                className="p-2 text-red-500 rounded-full"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center mt-8">
              <button
                className={`flex items-center px-6 py-2 rounded-md ${
                  screenCompleted.hours ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"
                }`}
                onClick={advanceScreen}
                disabled={!screenCompleted.hours}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </>
        )
      case "menu":
        return (
          <>
            <div className="bg-gray-100 rounded-lg p-4 mb-6 border-l-4 border-amber-500">
              <h2 className="text-lg font-semibold text-amber-700">{welcomeMessage.title}</h2>
              <p className="text-gray-600">{welcomeMessage.message}</p>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add your menu</h1>
            <div className="mb-6">
              <p className="font-medium text-gray-800 mb-3">Choose how you want to offer your menu</p>
              <div className="flex space-x-4 mb-6">
                <button
                  className={`flex-1 py-3 px-4 border ${
                    menuOption === "link" ? "border-amber-500 bg-amber-50" : "border-gray-300"
                  } rounded-md text-center`}
                  onClick={() => setMenuOption("link")}
                >
                  Menu link
                </button>
                <button
                  className={`flex-1 py-3 px-4 border ${
                    menuOption === "upload" ? "border-amber-500 bg-amber-50" : "border-gray-300"
                  } rounded-md text-center`}
                  onClick={() => setMenuOption("upload")}
                >
                  Upload menu
                </button>
              </div>
              {menuOption === "link" ? (
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="yourwebsite.com/menus"
                    value={menuLink}
                    onChange={(e) => setMenuLink(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-amber-500"
                  />
                </div>
              ) : (
                <div className="mb-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <input
                      type="file"
                      className="hidden"
                      id="menu-file"
                      onChange={(e) => setMenuFile(e.target.files[0])}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="menu-file"
                      className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-amber-500 text-white rounded-md"
                    >
                      Select file
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      {menuFile ? menuFile.name : "PDF, Word or images (max. 10MB)"}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-8">
              <button
                className={`flex items-center px-6 py-2 rounded-md ${
                  screenCompleted.menu ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"
                }`}
                onClick={advanceScreen}
                disabled={!screenCompleted.menu}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </>
        )
      case "account":
        return (
          <>
            <div className="bg-gray-100 rounded-lg p-4 mb-6 border-l-4 border-amber-500">
              <h2 className="text-lg font-semibold text-amber-700">{welcomeMessage.title}</h2>
              <p className="text-gray-600">{welcomeMessage.message}</p>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Bank account</h1>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank routing number</label>
                <input
                  type="text"
                  placeholder="XXXXXXXXX"
                  value={bankAccount.routingNumber}
                  onChange={(e) => handleBankAccountChange("routingNumber", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-amber-500"
                  maxLength={9}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account number</label>
                <input
                  type="text"
                  placeholder="XXXXX"
                  value={bankAccount.accountNumber}
                  onChange={(e) => handleBankAccountChange("accountNumber", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-amber-500"
                  minLength={5}
                />
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Business</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Legal business name</label>
                    <input
                      type="text"
                      value={bankAccount.legalName}
                      onChange={(e) => handleBankAccountChange("legalName", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant type</label>
                    <div className="relative">
                      <select
                        value={bankAccount.restaurantType}
                        onChange={(e) => handleBankAccountChange("restaurantType", e.target.value)}
                        className="appearance-none w-full p-3 border border-gray-300 rounded-md pr-10 focus:border-amber-500"
                      >
                        <option>Physical</option>
                        <option>Virtual</option>
                        <option>Hybrid</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branches</label>
                    <div className="relative">
                      <select
                        value={bankAccount.branches}
                        onChange={(e) => handleBankAccountChange("branches", e.target.value)}
                        className="appearance-none w-full p-3 border border-gray-300 rounded-md pr-10 focus:border-amber-500"
                      >
                        <option value="">Select a number</option>
                        <option value="1">1</option>
                        <option value="2-5">2-5</option>
                        <option value="6-10">6-10</option>
                        <option value="10+">More than 10</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EIN/Tax ID number</label>
                    <input
                      type="text"
                      value={bankAccount.taxId}
                      onChange={(e) => handleBankAccountChange("taxId", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button
                className={`flex items-center px-6 py-2 rounded-md ${
                  screenCompleted.account ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"
                }`}
                onClick={advanceScreen}
                disabled={!screenCompleted.account}
              >
                Finish
                <Check className="w-5 h-5 ml-2" />
              </button>
            </div>
          </>
        )
      default:
        return null
    }
  }

  const renderSidebar = () => (
    <div className="w-60 border-r border-gray-200 flex flex-col fixed top-14 bottom-0 left-0">
      <div className="p-4 border-b border-gray-200">
        <div className="font-bold">name 1</div>
        <div className="text-amber-600">Store</div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {[
          { key: "storeInfo", label: "Store Information" },
          { key: "order", label: "Ordering method" },
          { key: "hours", label: "Store hours" },
          { key: "menu", label: "Menu" },
          { key: "account", label: "Bank account" },
        ].map((item, idx) => {
          const disabled =
            (idx === 1 && !screenCompleted.storeInfo) ||
            (idx === 2 && !screenCompleted.order) ||
            (idx === 3 && !screenCompleted.hours) ||
            (idx === 4 && !screenCompleted.menu)
          return (
            <div
              key={item.key}
              className={`py-2 px-4 flex items-center text-sm cursor-pointer ${
                screen === item.key ? "bg-amber-50 border-l-4 border-amber-500" : ""
              } ${disabled ? "opacity-60" : ""}`}
              onClick={() => !disabled && setScreen(item.key)}
            >
              <div
                className={`w-6 h-6 rounded-full ${
                  screen === item.key
                    ? "bg-amber-500 text-white"
                    : screenCompleted[item.key]
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                } flex items-center justify-center mr-2`}
              >
                {screenCompleted[item.key] ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={screen === item.key ? "text-amber-700 font-medium" : "text-gray-700"}>
                {item.label}
              </span>
              {disabled && (
                <div className="ml-auto">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="p-4 border-t border-gray-200 flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
        <span>Ramiro Alet</span>
        <ChevronDown className="ml-auto w-5 h-5" />
      </div>
    </div>
  )

  return (
    <Fragment>
      <Toaster position="top-right" />
      <div className="flex min-h-screen">
        <div className="fixed top-0 left-0 right-0 bg-amber-500 h-14 z-10 flex items-center px-4">
          <span className="text-white font-bold text-xl mr-2">BODEGA+</span>
        </div>
        {renderSidebar()}
        <div className="flex-1 ml-60 mt-14 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between mb-6">
              <button
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-200"
                onClick={goBackScreen}
                disabled={screen === "storeInfo"}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default StoreConfiguration
