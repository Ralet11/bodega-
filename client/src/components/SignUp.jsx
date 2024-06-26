import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { getParamsEnv } from "../functions/getParamsEnv";
import Input from "../ui_bodega/Input";
import image1 from './../assets/image1.jpg';
import toast from "react-hot-toast";


const { API_URL_BASE } = getParamsEnv();

const SignUp = ({ setSelected, setLogged }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({})

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

    if (!formData.phone) {
      errors.phone = 'Phone is required';
      isValid = false;
    }

    if (!formData.address) {
      errors.address = 'Address is required';
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
        let errorMessage = '';
        if (error.response && error.response.data && error.response.data.message) {
          if (error.response.data.message.includes('users_Email_key')) {
            errorMessage = 'Email already in use';
          } else if (error.response.data.message.includes('users_UserName_key')) {
            errorMessage = 'UserName already in use';
          } else if (error.response.data.message.includes('users_Phone_key')) {
            errorMessage = 'Phone already in use';
          } else {
            errorMessage = 'There was an error in the registration, please check the fields and try again.';
          }
        } else {
          errorMessage = 'There was an error in the registration, please check the fields and try again.';
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

  const hasErrors = Object.values(errors).some(error => error) || Object.values(formData).some(field => !field);

  return (
    <div className="w-full h-full bg-yellow-400">
      <div className="flex justify-center items-center min-h-screen bg-yellow-400 bg-custom-img" style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
        <div className="flex flex-col justify-center items-center min-h-screen bg-cover">
          <div className="w-full max-w-md px-4 mx-auto mt-0 md:flex-0 shrink-0">
            <div className="flex flex-col gap-3 justify-center items-center px-3 mx-auto mt-0 md:flex-0 shrink-0">
              <div className="relative flex flex-col min-w-0 break-words bg-black bg-opacity-20 border-0 shadow-soft-xl rounded-2xl bg-clip-border p-10">
                <h1 className="text-2xl font-bold mb-6 text-center text-white">Create Your Account</h1>
                <div className="flex flex-wrap justify-center">
                  <div className="w-full px-3 mb-4">
                    <label className="text-white" htmlFor="name">Name</label>
                    <Input onChange={handleInputChange} id="name" placeholder="Enter your name" type="name" name="name" />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div className="w-full px-3 mb-4">
                    <label className="text-white" htmlFor="email">Email</label>
                    <Input onChange={handleInputChange} id="email" placeholder="Enter your email" type="email" name="email" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div className="w-full px-3 mb-4">
                    <label className="text-white" htmlFor="password">Password</label>
                    <Input onChange={handleInputChange} id="password" placeholder="Enter your password" type="password" name="password" />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  <div className="w-full px-3 mb-4">
                    <label className="text-white" htmlFor="confirmPassword">Confirm Password</label>
                    <Input onChange={handleInputChange} id="confirmPassword" placeholder="Confirm your password" type="password" name="confirmPassword" />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                  <div className="w-full px-3 mb-4">
                    <label className="text-white" htmlFor="phone">Phone</label>
                    <Input onChange={handleInputChange} id="phone" placeholder="Enter your phone" type="phone" name="phone" />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div className="w-full px-3 mb-4">
                    <label className="text-white" htmlFor="address">Address</label>
                    <Input onChange={handleInputChange} id="address" placeholder="Enter your address" type="address" name="address" />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                  <div className="text-center relative w-full">
                    <button onClick={handleSubmit} type="submit" className={`w-full bg-yellow-500 text-white p-3 rounded-md focus:outline-none ${hasErrors ? 'cursor-not-allowed opacity-50' : 'hover:bg-indigo-600'}`} disabled={hasErrors}>
                      <span className="text-white hover:text-black">Sign up</span>
                    </button>
                  </div>
                  <p className="mt-4 mb-0 leading-normal text-white text-sm">Don't have an account? <a onClick={goLogin} className="font-bold cursor-pointer text-white hover:text-indigo-800">Log in</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;