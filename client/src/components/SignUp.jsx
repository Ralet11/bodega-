"use client"

import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import toast, { Toaster } from "react-hot-toast"

import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin } from "lucide-react"

import { getParamsEnv } from "../functions/getParamsEnv"
import TermsModal from "./TermsAndConditions"

const { API_URL_BASE } = getParamsEnv()

const SignUpForm = ({ setSelected, setLogged }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Validaciones front-end
  const [errors, setErrors] = useState({})
  // Estado para el modal de términos
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  // Checkbox de términos
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Mostrar / Ocultar passwords
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Campos del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target
    let error = ""

    if (name === "name" && !value.trim()) {
      error = "Name is required"
    } else if (name === "email" && (!value.trim() || !/\S+@\S+\.\S+/.test(value))) {
      error = "Email is invalid"
    } else if (name === "password" && !value.trim()) {
      error = "Password is required"
    } else if (name === "confirmPassword" && value !== formData.password) {
      error = "Passwords do not match"
    } else if ((name === "phone" || name === "address") && !value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
    }

    setFormData({
      ...formData,
      [name]: value,
    })

    setErrors({
      ...errors,
      [name]: error,
    })
  }

  // Manejo del checkbox de términos
  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked)
  }

  // Validaciones simples front-end
  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    if (!formData.name) {
      newErrors.name = "User Name is required"
      isValid = false
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required"
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // LÓGICA “ANTIGUA” DE REGISTRO (con toast)
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Limpiamos toasts antiguos y validamos
    if (validateForm()) {
      try {
        // Petición al backend
        const response = await axios.post(`${API_URL_BASE}/api/auth/register`, formData)

        // Chequeamos si el servidor responde con algo como:
        // { data: { created: "ok" } }
        if (response.data?.data?.created === "ok") {
          toast.success("Account created successfully")
          // Al crearse con éxito:
          setLogged(true)
          setSelected(true)
        } else {
          // Si la respuesta no es la esperada, mostrar error genérico
          toast.error("Failed to create account. Please try again.")
        }
      } catch (error) {
        let errorMessage = "There was an error in the registration."
        // Si el servidor envía un mensaje de error
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        }
        toast.error(errorMessage)
        console.error("Error submitting data to the server:", error)
      }
    } else {
      toast.error("Please fix the errors in the form before submitting")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Toast para mensajes */}
      <Toaster position="top-center" />

      <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4 text-center sm:text-left">
        Create Your Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME FIELD */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
        </div>

        {/* EMAIL FIELD */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* PASSWORD FIELD */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 
                         rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Enter your password"
            />
             <div className="absolute right-3 top-1/2 transform -translate-y-1/2 
                        w-8 h-8 flex items-center justify-center">
                            <motion.button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              // Elimina el escalado o redúcelo para evitar movimientos
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                            >
                              {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </motion.button>
                          </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
        </div>

        {/* CONFIRM PASSWORD FIELD */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-12 py-2 border border-gray-300
                         rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Confirm your password"
            />
             <div className="absolute right-3 top-1/2 transform -translate-y-1/2 
                        w-8 h-8 flex items-center justify-center">
                            <motion.button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              // Elimina el escalado o redúcelo para evitar movimientos
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                            >
                              {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </motion.button>
                          </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* PHONE FIELD */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 
                         rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Enter your phone number"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* ADDRESS FIELD */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300
                         rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Enter your address"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
        </div>

        {/* TÉRMINOS CHECKBOX */}
        <div className="space-y-2">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={termsAccepted}
              onChange={handleCheckboxChange}
              className="mt-1 h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I accept the{" "}
              <span
                onClick={() => setIsTermsModalOpen(true)}
                className="text-yellow-500 hover:text-yellow-600 cursor-pointer"
              >
                terms and conditions
              </span>
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
        </div>

        {/* BOTÓN SUBMIT */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={!termsAccepted}
          className={`w-full py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium 
                      text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 
                      ${!termsAccepted ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Create Account
        </motion.button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <motion.button
            onClick={() => setSelected(true)}
            className="font-medium text-yellow-500 hover:text-yellow-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log in
          </motion.button>
        </p>
      </form>

      {/* Modal de Términos */}
      {isTermsModalOpen && (
        <TermsModal show={isTermsModalOpen} preHandleClose={() => setIsTermsModalOpen(false)} />
      )}
    </div>
  )
}

export default SignUpForm
