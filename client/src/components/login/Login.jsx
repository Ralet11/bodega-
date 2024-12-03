import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { changeShop, getCategories, loginSuccess } from "../../redux/actions/actions";
import { getParamsEnv } from "../../functions/getParamsEnv";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const { API_URL_BASE } = getParamsEnv();

const Login = ({ setSelected }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL_BASE}/api/auth/login`, {
        email,
        password,
        credentials: true,
      });

      if (response.data.error === false) {
        const clientData = response.data.data;

        if (clientData.locals.length === 0 || clientData.locals.every(local => local.status === 0)) {
          dispatch(loginSuccess(clientData));
          dispatch(getCategories());
          navigate(`/create-shop`);
        } else {
          const shopId = clientData.locals[0].id;
          dispatch(loginSuccess(clientData));
          dispatch(changeShop(shopId));
          dispatch(getCategories());
          navigate(`/dashboard`);
        }
        toast.success('Login successful!');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

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
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2.5 sm:py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </motion.button>

          <p className="mt-3 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => setSelected(false)}
              className="font-medium text-yellow-600 hover:text-yellow-500"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
