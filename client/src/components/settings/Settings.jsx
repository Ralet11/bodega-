import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import AddressMap from "./AddressMap"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import toast, { Toaster } from "react-hot-toast"
import { setClientLocals } from "../../redux/actions/actions"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import {
  Plus,
  X,
  Phone,
  Globe,
  FileText,
  ImageIcon
} from "lucide-react"
import { getParamsEnv } from "../../functions/getParamsEnv"
import { useNavigate, useLocation } from "react-router-dom"

const { API_URL_BASE } = getParamsEnv()

const daysOfWeek = [
  { day: "Monday", code: "mon" },
  { day: "Tuesday", code: "tue" },
  { day: "Wednesday", code: "wed" },
  { day: "Thursday", code: "thu" },
  { day: "Friday", code: "fri" },
  { day: "Saturday", code: "sat" },
  { day: "Sunday", code: "sun" },
]

export default function HypermodernShopSettings() {
  const activeShop = useSelector((state) => state.activeShop)
  const client = useSelector((state) => state.client)
  const token = client.token
  const categories = useSelector((state) => state.categories)
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const location = useLocation()

  const [activeTab, setActiveTab] = useState("info")
  const [viewMode, setViewMode] = useState("mobile")
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [isEditingWebsite, setIsEditingWebsite] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)

  const [nameBackup, setNameBackup] = useState("")
  const [phoneBackup, setPhoneBackup] = useState("")
  const [websiteBackup, setWebsiteBackup] = useState("")
  const [descriptionBackup, setDescriptionBackup] = useState("")

  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  const [shopData, setShopData] = useState({
    id: "",
    name: "",
    phone: "",
    address: "",
    logo: "",
    placeImage: "",
    deliveryImage: "",
    lat: null,
    lng: null,
    category: "",
    delivery: false,
    pickUp: false,
    orderIn: false,
    website: "",
    description: "",
    einNumber: "",
    openingHours: daysOfWeek.map((day) => ({
      ...day,
      open: "00:00",
      close: "23:59",
    })),
  })

  const [latLong, setLatLong] = useState({ lat: -34.397, lng: 150.644 })
  const [isSaving, setIsSaving] = useState(false)

  const logoInputRef = useRef(null)
  const placeImageInputRef = useRef(null)
  const deliveryImageInputRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL_BASE}/api/local/get/${activeShop}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = response.data
        console.log(data, "dat")

        const openingHours = daysOfWeek.map(({ day, code }) => {
          const matched = data.openingHours.find((oh) => oh.day === day)
          return {
            day,
            code,
            open: matched ? matched.open_hour.slice(0, 5) : "00:00",
            close: matched ? matched.close_hour.slice(0, 5) : "23:59",
          }
        })

        setShopData({
          id: data.id,
          name: data.name,
          phone: data.phone,
          address: data.address,
          logo: data.logo,
          placeImage: data.placeImage,
          deliveryImage: data.deliveryImage,
          lat: data.lat,
          lng: data.lng,
          category: data.locals_categories_id || "",
          delivery: data.delivery,
          pickUp: data.pickUp,
          orderIn: data.orderIn,
          website: data.website || "",
          description: data.description || "",
          einNumber: data.einNumber || "",
          openingHours,
        })

        setSelectedTags(data.tags || [])
        setLatLong({ lat: data.lat, lng: data.lng })
      } catch (error) {
        toast.error("Error fetching shop data.")
        console.error("Error fetching shop data:", error)
      }
    }
    fetchData()
  }, [activeShop])

  useEffect(() => {
    const fetchTags = async () => {
      if (shopData.category) {
        try {
          const response = await axios.get(`${API_URL_BASE}/api/tags/getAll`)
          setTags(response.data.data)
        } catch (error) {
          console.error("Error fetching tags:", error)
        }
      }
    }
    fetchTags()
  }, [shopData.category])

  const handleAddTag = (tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag])
    }
  }
  const handleRemoveTag = (tagId) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId))
  }
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setShopData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }
  const handleOpeningHoursChange = (index, field, value) => {
    setShopData((prev) => ({
      ...prev,
      openingHours: prev.openingHours.map((h, i) =>
        i === index ? { ...h, [field]: value } : h
      ),
    }))
  }
  const handleImageChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const valid = ["image/png", "image/jpeg"]
      if (!valid.includes(file.type)) {
        toast.error("Please upload PNG or JPG")
        return
      }
      const url = URL.createObjectURL(file)
      setShopData((prev) => ({ ...prev, [type]: url }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const updatedShop = {
      id: shopData.id,
      name: shopData.name,
      phone: shopData.phone,
      logo: shopData.logo,
      placeImage: shopData.placeImage,
      deliveryImage: shopData.deliveryImage,
      category: shopData.category || null,
      delivery: shopData.delivery,
      pickUp: shopData.pickUp,
      orderIn: shopData.orderIn,
      website: shopData.website,
      description: shopData.description,
      einNumber: shopData.einNumber,
      tags: selectedTags.map((t) => t.id),
    }

    try {
      const res = await axios.put(
        `${API_URL_BASE}/api/local/update/${shopData.id}`,
        updatedShop,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Shop data updated successfully.")
      dispatch(setClientLocals(res.data.locals))

      const formatted = shopData.openingHours.map((h) => ({
        day: h.code,
        open: h.open,
        close: h.close,
      }))
      await axios.post(
        `${API_URL_BASE}/api/local/updateOpeningHours`,
        { localId: shopData.id, openingHours: formatted },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const formData = new FormData()
      formData.append("id", shopData.id)
      formData.append("action", "shop")
      if (logoInputRef.current?.files[0]) formData.append("logo", logoInputRef.current.files[0])
      if (placeImageInputRef.current?.files[0])
        formData.append("placeImage", placeImageInputRef.current.files[0])
      if (deliveryImageInputRef.current?.files[0])
        formData.append("deliveryImage", deliveryImageInputRef.current.files[0])

      if ([...formData.keys()].length > 2) {
        const imgRes = await axios.post(`${API_URL_BASE}/api/up-image/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        if (imgRes.status === 200) {
          toast.success("Images uploaded successfully")
          const { logo, placeImage, deliveryImage } = imgRes.data
          setShopData((prev) => ({
            ...prev,
            logo: logo || prev.logo,
            placeImage: placeImage || prev.placeImage,
            deliveryImage: deliveryImage || prev.deliveryImage,
          }))
        } else {
          toast.error("Error uploading images")
        }
      }
    } catch (err) {
      toast.error("Error saving shop data.")
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEditName = () => {
    setShopData((prev) => ({ ...prev, name: nameBackup }))
    setIsEditingName(false)
  }
  const handleCancelEditPhone = () => {
    setShopData((prev) => ({ ...prev, phone: phoneBackup }))
    setIsEditingPhone(false)
  }
  const handleCancelEditWebsite = () => {
    setShopData((prev) => ({ ...prev, website: websiteBackup }))
    setIsEditingWebsite(false)
  }
  const handleCancelEditDescription = () => {
    setShopData((prev) => ({ ...prev, description: descriptionBackup }))
    setIsEditingDescription(false)
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
          <h1 className="text-3xl font-bold text-gray-800">Shop Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex -mb-px">
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === "info"
                    ? "border-b-2 border-amber-500 text-amber-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("info")}
              >
                Information
              </button>
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === "appearance"
                    ? "border-b-2 border-amber-500 text-amber-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("appearance")}
              >
                Appearance
              </button>
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === "hours"
                    ? "border-b-2 border-amber-500 text-amber-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("hours")}
              >
                Hours
              </button>
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === "services"
                    ? "border-b-2 border-amber-500 text-amber-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("services")}
              >
                Services
              </button>
              <button
                type="button"
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === "tags"
                    ? "border-b-2 border-amber-500 text-amber-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("tags")}
              >
                Tags
              </button>
            </div>
          </div>

          {/* Panels */}
          <div className="bg-white rounded-lg">
            {activeTab === "info" && (
              <div className="p-6 space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">Shop Name</label>
                  {!isEditingName ? (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700">{shopData.name}</p>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                        onClick={() => {
                          setNameBackup(shopData.name)
                          setIsEditingName(true)
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        name="name"
                        value={shopData.name}
                        onChange={handleChange}
                        className="flex-1 py-2 px-3 border rounded-md"
                      />
                      <button
                        type="button"
                        className="px-3 py-1 border rounded-md text-sm"
                        onClick={handleCancelEditName}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-700">Phone number</h3>
                    </div>
                    {!isEditingPhone ? (
                      <button
                        type="button"
                        className="px-3 py-1 border rounded-md text-sm"
                        onClick={() => {
                          setPhoneBackup(shopData.phone)
                          setIsEditingPhone(true)
                        }}
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-3 py-1 border rounded-md text-sm"
                        onClick={handleCancelEditPhone}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  {isEditingPhone ? (
                    <PhoneInput
                      country="us"
                      value={shopData.phone}
                      onChange={(value) =>
                        setShopData((prev) => ({ ...prev, phone: value }))
                      }
                      inputClass="w-full py-2 px-3 border rounded-md"
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{shopData.phone}</p>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-700">Website</h3>
                    </div>
                    {!isEditingWebsite ? (
                      <button
                        type="button"
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                        onClick={() => {
                          setWebsiteBackup(shopData.website)
                          setIsEditingWebsite(true)
                        }}
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-3 py-1 border rounded-md text-sm"
                        onClick={handleCancelEditWebsite}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  {isEditingWebsite ? (
                    <input
                      name="website"
                      value={shopData.website}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border rounded-md"
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{shopData.website}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-700">Description</h3>
                    </div>
                    {!isEditingDescription ? (
                      <button
                        type="button"
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                        onClick={() => {
                          setDescriptionBackup(shopData.description)
                          setIsEditingDescription(true)
                        }}
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-3 py-1 border rounded-md text-sm"
                        onClick={handleCancelEditDescription}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  {isEditingDescription ? (
                    <textarea
                      name="description"
                      value={shopData.description}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border rounded-md"
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{shopData.description}</p>
                  )}
                </div>

                {/* EIN / Tax ID */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    EIN / Tax ID
                  </label>
                  <input
                    name="einNumber"
                    value={shopData.einNumber}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border rounded-md"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Address
                  </label>
                  <AddressMap
                    setShopData={setShopData}
                    shopData={shopData}
                    latLong={latLong}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Category
                  </label>
                  <select
                    name="category"
                    value={shopData.category}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border rounded-md"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-medium">Store Logo and Header</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    This will apply to all your stores on DoorDash to highlight your brand
                  </p>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 border-b">
                      <button
                        type="button"
                        onClick={() => setViewMode("mobile")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          viewMode === "mobile"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-white border border-gray-300 text-gray-600"
                        }`}
                      >
                        Mobile device view
                      </button>
                      {/* Podrías agregar vista desktop si quisieras */}
                    </div>

                    <div className="p-6 flex flex-col items-center">
                      <div className="w-full max-w-md bg-gray-100 rounded-lg p-8 relative">
                        <div className="aspect-[3/1] bg-gray-200 rounded-lg flex items-center justify-center mb-6 relative">
                          {shopData.placeImage ? (
                            <img
                              src={shopData.placeImage}
                              alt="Header"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-gray-500 text-sm">Header</div>
                          )}
                          <button
                            type="button"
                            onClick={() => placeImageInputRef.current?.click()}
                            className="absolute right-2 top-2 h-8 w-8 p-0 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <input
                            ref={placeImageInputRef}
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, "placeImage")}
                          />
                        </div>

                        <div className="relative">
                          <div className="absolute -top-10 left-4">
                            <div className="h-20 w-20 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center relative overflow-hidden">
                              {shopData.logo ? (
                                <img
                                  src={shopData.logo}
                                  alt="Logo"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-gray-500 text-sm">Logo</div>
                              )}
                              <button
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                className="absolute right-0 bottom-0 h-8 w-8 p-0 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                              <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/png, image/jpeg"
                                className="hidden"
                                onChange={(e) => handleImageChange(e, "logo")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Sección de Delivery Image (opcional) */}
              </div>
            )}

            {/* Hours Tab */}
            {activeTab === "hours" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Working Hours</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shopData.openingHours.map((day, index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">
                        {day.day}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="time"
                          value={day.open}
                          onChange={(e) =>
                            handleOpeningHoursChange(index, "open", e.target.value)
                          }
                          className="flex-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                        />
                        <input
                          type="time"
                          value={day.close}
                          onChange={(e) =>
                            handleOpeningHoursChange(index, "close", e.target.value)
                          }
                          className="flex-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === "services" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Services</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="delivery"
                      name="delivery"
                      type="checkbox"
                      checked={shopData.delivery}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="delivery" className="ml-2 block text-sm text-gray-700">
                      Delivery
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="pickUp"
                      name="pickUp"
                      type="checkbox"
                      checked={shopData.pickUp}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="pickUp" className="ml-2 block text-sm text-gray-700">
                      Pick-up
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="orderIn"
                      name="orderIn"
                      type="checkbox"
                      checked={shopData.orderIn}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="orderIn" className="ml-2 block text-sm text-gray-700">
                      Order In
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Tags Tab */}
            {activeTab === "tags" && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Tags</h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Available Tags</h3>
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddTag(tag)
                          }}
                          className={`py-1 px-3 rounded-full text-sm font-medium transition-colors duration-200 ${
                            selectedTags.some((st) => st.id === tag.id)
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No tags for this category</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Selected Tags</h3>
                  {selectedTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <div
                          key={tag.id}
                          className="bg-amber-100 text-amber-800 py-1 px-3 rounded-full flex items-center gap-2 text-sm"
                        >
                          {tag.name}
                          <button
                            onClick={() => handleRemoveTag(tag.id)}
                            className="text-amber-600 hover:text-amber-800 transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No tags selected yet</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Botón para guardar */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="sticky bottom-0 bg-white p-4 z-10 rounded-b-2xl shadow-inner"
          >
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md hover:from-amber-600 hover:to-amber-700 transition duration-300 ease-in-out font-medium text-sm shadow-md"
            >
              {isSaving ? (
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
                "Save changes"
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}
