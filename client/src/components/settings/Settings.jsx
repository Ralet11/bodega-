'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import AddressMap from "./AddressMap"
import axios from 'axios'
import { getParamsEnv } from "../../functions/getParamsEnv"
import { useDispatch, useSelector } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast'
import { setClientLocals } from '../../redux/actions/actions'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { PlusIcon, XIcon } from 'lucide-react'

const { API_URL_BASE } = getParamsEnv()

const daysOfWeek = [
  { day: 'Monday', code: 'mon' },
  { day: 'Tuesday', code: 'tue' },
  { day: 'Wednesday', code: 'wed' },
  { day: 'Thursday', code: 'thu' },
  { day: 'Friday', code: 'fri' },
  { day: 'Saturday', code: 'sat' },
  { day: 'Sunday', code: 'sun' },
]

export default function HypermodernShopSettings() {
  const activeShop = useSelector((state) => state.activeShop)
  const client = useSelector((state) => state.client)
  const token = client.token
  const categories = useSelector((state) => state.categories)
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [shopData, setShopData] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
    logo: '',
    placeImage: '',
    deliveryImage: '',
    lat: null,
    lng: null,
    category: "",
    delivery: false,
    pickUp: false,
    orderIn: false,
    openingHours: daysOfWeek.map(day => ({ ...day, open: '', close: '' }))
  })

  const [latLong, setLatLong] = useState({ lat: -34.397, lng: 150.644 })
  const [isUploading, setIsUploading] = useState(false)
  const logoInputRef = useRef(null)
  const placeImageInputRef = useRef(null)
  const deliveryImageInputRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/local/get/${activeShop}`)
        const data = response.data
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
          openingHours: daysOfWeek.map(day => {
            const matchedDay = data.openingHours.find(openHour => openHour.day === day.code)
            return matchedDay
              ? { ...day, open: matchedDay.open_hour, close: matchedDay.close_hour }
              : { ...day, open: '', close: '' }
          })
        })
        setSelectedTags(data.tags || [])
        setLatLong({ lat: data.lat, lng: data.lng })
      } catch (error) {
        toast.error('Error fetching shop data.')
        console.error('Error en la solicitud:', error)
      }
    }
    fetchData()
  }, [activeShop])

  useEffect(() => {
    const fetchTags = async () => {
      if (shopData.category) {
        try {
          const response = await axios.get(`${API_URL_BASE}/api/tags/getAllByLocalCat/${shopData.category}`)
          setTags(response.data.data)
        } catch (error) {
          console.error('Error fetching tags:', error)
        }
      }
    }
    fetchTags()
  }, [shopData.category])

  const handleAddTag = (tag) => {
    if (!selectedTags.some((selectedTag) => selectedTag.id === tag.id)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tagId) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setShopData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleOpeningHoursChange = (index, field, value) => {
    setShopData(prevState => ({
      ...prevState,
      openingHours: prevState.openingHours.map((hour, i) =>
        i === index ? { ...hour, [field]: value } : hour
      )
    }))
  }

  const handleImageUpload = async () => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append('id', shopData.id)
    formData.append('action', 'shop')

    if (logoInputRef.current.files[0]) {
      formData.append('logo', logoInputRef.current.files[0])
    }
    if (placeImageInputRef.current.files[0]) {
      formData.append('placeImage', placeImageInputRef.current.files[0])
    }
    if (deliveryImageInputRef.current.files[0]) {
      formData.append('deliveryImage', deliveryImageInputRef.current.files[0])
    }

    try {
      const response = await axios.post(`${API_URL_BASE}/api/up-image/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 200) {
        toast.success('Images uploaded successfully')
        const { logo, placeImage, deliveryImage } = response.data
        setShopData(prevData => ({
          ...prevData,
          logo: logo || prevData.logo,
          placeImage: placeImage || prevData.placeImage,
          deliveryImage: deliveryImage || prevData.deliveryImage
        }))
      } else {
        toast.error('Error uploading images')
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Error uploading images')
    }

    setIsUploading(false)
  }

  const handleImageChange = (event, type) => {
    const file = event.target.files[0]
    if (file) {
      const validTypes = ['image/png', 'image/jpeg']
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a PNG or JPG image')
        return
      }
      const imageUrl = URL.createObjectURL(file)
      setShopData(prevData => ({
        ...prevData,
        [type]: imageUrl
      }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
  
    const updatedShop = {
      id: shopData.id,
      name: shopData.name,
      phone: shopData.phone,
      logo: shopData.logo,
      placeImage: shopData.placeImage,
      deliveryImage: shopData.deliveryImage,
      category: shopData.category,
      delivery: shopData.delivery,
      pickUp: shopData.pickUp,
      orderIn: shopData.orderIn,
      tags: selectedTags.map(tag => tag.id)
    }
  
    try {
      const response = await axios.put(`${API_URL_BASE}/api/local/update/${shopData.id}`, updatedShop, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success('Shop data updated successfully.')
      dispatch(setClientLocals(response.data.locals))
    } catch (error) {
      toast.error('Error updating shop data.')
      console.error('Error updating shop data', error)
    }
  
    const formattedOpeningHours = shopData.openingHours.map(hour => ({
      day: hour.code,
      open: hour.open,
      close: hour.close,
    }))
  
    try {
      await axios.post(
        `${API_URL_BASE}/api/local/updateOpeningHours`,
        {
          localId: shopData.id,
          openingHours: formattedOpeningHours
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    } catch (error) {
      toast.error('Error saving opening hours.')
      console.error('Error saving opening hours:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-12">
      <Toaster position="top-right" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Shop Settings</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <InputField
              label="Shop Name"
              id="name"
              name="name"
              value={shopData.name}
              onChange={handleChange}
              placeholder="Enter your shop name"
            />

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium text-gray-700 block">
                Address
              </label>
              <AddressMap setShopData={setShopData} shopData={shopData} latLong={latLong} />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 block">
                Phone
              </label>
              <PhoneInput
                country={'us'}
                value={shopData.phone}
                inputClass="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onChange={(value) => setShopData(prevState => ({ ...prevState, phone: value }))} 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-gray-700 block">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={shopData.category}
                onChange={handleChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

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
                          selectedTags.some((selectedTag) => selectedTag.id === tag.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                        className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full flex items-center gap-2 text-sm"
                      >
                        {tag.name}
                        <button
                          onClick={() => handleRemoveTag(tag.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No tags selected yet</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Shop Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ImageUpload
                  label="Logo"
                  image={shopData.logo}
                  onChange={(e) => handleImageChange(e, 'logo')}
                  inputRef={logoInputRef}
                />
                <ImageUpload
                  label="Place Image"
                  image={shopData.placeImage}
                  onChange={(e) => handleImageChange(e, 'placeImage')}
                  inputRef={placeImageInputRef}
                />
                <ImageUpload
                  label="Delivery Image"
                  image={shopData.deliveryImage}
                  onChange={(e) => handleImageChange(e, 'deliveryImage')}
                  inputRef={deliveryImageInputRef}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center"
                  onClick={handleImageUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    'Upload Images'
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Working Hours</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopData.openingHours.map((day, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">{day.day}</label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={day.open}
                        onChange={(e) => handleOpeningHoursChange(index, 'open', e.target.value)}
                        className="flex-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="time"
                        value={day.close}
                        onChange={(e) => handleOpeningHoursChange(index, 'close', e.target.value)}
                        className="flex-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Services</h2>
              <div className="space-y-2">
                <Checkbox
                  id="delivery"
                  name="delivery"
                  checked={shopData.delivery}
                  onChange={handleChange}
                  label="Delivery"
                />
                <Checkbox
                  id="pickUp"
                  name="pickUp"
                  checked={shopData.pickUp}
                  onChange={handleChange}
                  label="Pick-up"
                />
                <Checkbox
                  id="orderIn"
                  name="orderIn"
                  checked={shopData.orderIn}
                  onChange={handleChange}
                  label="Order In"
                />
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out font-medium text-lg shadow-md"
              >
                Save Changes
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

function InputField({ label, id, ...props }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 block">
        {label}
      </label>
      <input
        id={id}
        className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        {...props}
      />
    </div>
  )
}

function ImageUpload({ label, image, onChange, inputRef }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 block">{label}</label>
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-w-16 aspect-h-9 group">
        {image ? (
          <img src={image} alt={label} className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <PlusIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={onChange}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            className="bg-white py-2 px-4 rounded-md text-gray-800 font-medium hover:bg-gray-100 transition duration-300 ease-in-out"
            onClick={() => inputRef.current?.click()}
          >
            Change
          </button>
        </div>
      </div>
    </div>
  )
}

function Checkbox({ id, label, ...props }) {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        {...props}
      />
      <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
        {label}
      </label>
    </div>
  )
}