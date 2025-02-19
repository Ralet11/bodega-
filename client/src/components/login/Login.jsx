"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { changeShop, getCategories, loginSuccess } from "../../redux/actions/actions"
import { getParamsEnv } from "../../functions/getParamsEnv"

const { API_URL_BASE } = getParamsEnv()

const Login = ({ setSelected }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState("login") // login, requestEmail, verifyCode, resetPassword
  const [resetEmail, setResetEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL_BASE}/api/auth/login`, { email, password, credentials: true })
      if (response.data.error === false) {
        const clientData = response.data.data
        if (!clientData.locals || clientData.locals.length === 0 || clientData.locals.every((local) => local.status === 0)) {
          dispatch(loginSuccess(clientData))
          dispatch(getCategories())
          navigate(`/create-shop`)
        } else {
          const shopId = clientData.locals[0].id
          dispatch(loginSuccess(clientData))
          dispatch(changeShop(shopId))
          dispatch(getCategories())
          navigate(`/dashboard`)
        }
        toast.success("Login successful!")
      } else {
        toast.error("Invalid email or password")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL_BASE}/api/auth/request-reset`, { email: resetEmail });
      if (res.data.success) {
        toast.success("Verification code sent to your email!");
        setStep("verifyCode");
      } else {
        toast.error(res.data.message || "Failed to send verification code.");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("Email not found. Please check and try again.");
      } else {
        toast.error("Error sending verification code.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await axios.post(`${API_URL_BASE}/api/auth/verify-code`, {
        email: resetEmail,
        code: verificationCode,
      })
      if (res.data.success) {
        toast.success("Code verified! Please reset your password.")
        setStep("resetPassword")
      } else {
        toast.error(res.data.message || "Invalid code.")
      }
    } catch (err) {
      toast.error("Error verifying code.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }
    setIsLoading(true)
    try {
      const res = await axios.post(`${API_URL_BASE}/api/auth/reset-password`, {
        email: resetEmail,
        newPassword,
      })
      if (res.data.success) {
        toast.success("Password reset successfully! Please login.")
        setStep("login")
      } else {
        toast.error(res.data.message || "Failed to reset password.")
      }
    } catch (err) {
      toast.error("Error resetting password.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Enter your password"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center">
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </motion.button>
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={isLoading}
        className={`w-full py-2.5 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
      >
        {isLoading ? "Logging in..." : "Log in"}
      </motion.button>
      <p className="mt-3 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <motion.button
              onClick={() => setSelected(false)}
              className="font-medium text-yellow-500 hover:text-yellow-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Sign up
            </motion.button>
          </p>
      <p className="text-center text-sm text-gray-600">
        <motion.button
          onClick={() => setStep("requestEmail")}
          className="font-medium text-yellow-500 hover:text-yellow-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Forgot password?
        </motion.button>
      </p>
    </form>
  )

  const renderRequestEmailForm = () => (
    <form onSubmit={handleRequestReset} className="space-y-4 sm:space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Reset your password</h3>
      <input
        type="email"
        required
        placeholder="Enter your email"
        value={resetEmail}
        onChange={(e) => setResetEmail(e.target.value)}
        className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
      />
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white"
      >
        {isLoading ? "Sending code..." : "Send Verification Code"}
      </motion.button>
      <p className="text-center text-sm text-gray-600">
        <motion.button
          onClick={() => setStep("login")}
          className="font-medium text-yellow-500 hover:text-yellow-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Back to Login
        </motion.button>
      </p>
    </form>
  )

  const renderVerifyCodeForm = () => (
    <form onSubmit={handleVerifyCode} className="space-y-4 sm:space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Enter the code sent to your email</h3>
      <input
        type="text"
        required
        maxLength="6"
        placeholder="6-digit code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
      />
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white"
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </motion.button>
    </form>
  )

  const renderResetPasswordForm = () => (
    <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Set a new password</h3>
      <input
        type="password"
        required
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
      />
      <input
        type="password"
        required
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
      />
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white"
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </motion.button>
    </form>
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex flex-col justify-center"
    >
      <Toaster position="top-center" />
      <div className="w-full max-w-xs sm:max-w-md mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{step === "login" ? "Welcome Back" : "Forgot Password"}</h2>
        {step === "login" && renderLoginForm()}
        {step === "requestEmail" && renderRequestEmailForm()}
        {step === "verifyCode" && renderVerifyCodeForm()}
        {step === "resetPassword" && renderResetPasswordForm()}
      </div>
    </motion.div>
  )
}

export default Login
