import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { getParamsEnv } from "../functions/getParamsEnv";
import Input from "../ui_bodega/Input";
import toast from "react-hot-toast";
import TermsModal from "./TermsAndConditions";

const { API_URL_BASE } = getParamsEnv();

const SignUpForm = ({ setSelected, setLogged }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'name' && !value.trim()) {
      error = 'Name is required';
    } else if (name === 'email' && (!value.trim() || !/\S+@\S+\.\S+/.test(value))) {
      error = 'Email is invalid';
    } else if (name === 'password' && !value.trim()) {
      error = 'Password is required';
    } else if (name === 'confirmPassword' && value !== formData.password) {
      error = 'Passwords do not match';
    } else if ((name === 'phone' || name === 'address') && !value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.name) {
      errors.name = 'User Name is required';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!termsAccepted) {
      errors.terms = 'You must accept the terms and conditions';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(`${API_URL_BASE}/api/auth/register`, formData);

        if (response.data.data.created === 'ok') {
          toast.success('Account created successfully');
          setLogged(true);
          setSelected(true);
        }
      } catch (error) {
        let errorMessage = 'There was an error in the registration, please check the fields and try again.';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        toast.error(errorMessage);
        console.error('Error submitting data to the server:', error);
      }
    } else {
      toast.error('Please fix the errors in the form before submitting');
    }
  };

  const goLogin = () => {
    setSelected(true);
  };

  return (
    <>
      <h2 className="text-lg md:text-xl font-semibold mb-4">Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2 md:mb-3 relative">
          <label className="text-gray-600" htmlFor="email">Name</label>
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            type="text"
            className="w-full pl-10 pr-4 py-1 md:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div className="mb-2 md:mb-3 relative">
          <label className="text-gray-600" htmlFor="email">Email</label>
          <Input
            label="E-mail"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            type="email"
            className="w-full pl-10 pr-4 py-1 md:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div className="mb-2 md:mb-3 relative">
          <label className="text-gray-600" htmlFor="email">Password</label>
          <Input
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            type="password"
            className="w-full pl-10 pr-4 py-1 md:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div className="mb-2 md:mb-3 relative">
          <label className="text-gray-600" htmlFor="email">Confirm Password</label>
          <Input
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            type="password"
            className="w-full pl-10 pr-4 py-1 md:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
        <div className="mb-2 md:mb-3 flex items-center">
          <input type="checkbox" id="terms" name="terms" checked={termsAccepted} onChange={handleCheckboxChange} />
          <label className="text-gray-600 ml-2" htmlFor="terms">
            I have read and accept the <span className="text-yellow-500 cursor-pointer hover:underline" onClick={() => setIsTermsModalOpen(true)}>terms and conditions of Bodega Store</span>.
          </label>
          {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
        </div>
        <button
          type="submit"
          className={`w-full bg-yellow-500 text-white font-bold py-2 rounded-md hover:bg-yellow-600 transition duration-200 ${!termsAccepted ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={!termsAccepted}
        >
          CREATE ACCOUNT
        </button>
        <p className="mt-2 md:mt-4 mb-0 leading-normal text-gray-600 text-sm">Already have an account? <a className="font-bold cursor-pointer text-yellow-500 hover:text-yellow-600" onClick={goLogin}>Log in</a></p>
      </form>
      {isTermsModalOpen && <TermsModal show={isTermsModalOpen} preHandleClose={() => setIsTermsModalOpen(false)} />}
    </>
  );
};

export default SignUpForm;
