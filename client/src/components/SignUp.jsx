/*   import axios from "axios";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { useDispatch } from 'react-redux';
  import { useSelector } from "react-redux/es/hooks/useSelector";
  import { getParamsEnv } from "../functions/getParamsEnv";
  import Input from "../ui_bodega/Input";
  import image1 from './../assets/image1.jpg';

  const { API_URL_BASE } = getParamsEnv()

  const SignUp = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
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


      console.log("Esto es formData: ", formData)

      if (validateForm()) {
        try {
          const response = await axios.post(`${API_URL_BASE}/api/auth/register`, formData);
          console.log(response.data)

          if (response.data.data.created === 'ok') {

            console.log("Succes at create user")
            navigate('/login');
          }
        } catch (error) {

          let errorMessage = '';
          if (
            error.response.data.message ===
            'llave duplicada viola restricción de unicidad «users_Email_key»'
          ) {
            errorMessage = 'Email already in use';
          } else if (
            error.response.data.message ===
            'llave duplicada viola restricción de unicidad «users_UserName_key»'
          ) {
            errorMessage = 'UserName already in use';
          } else if (
            error.response.data.message ===
            'llave duplicada viola restricción de unicidad «users_Phone_key»'
          ) {
            errorMessage = 'Phone already in use';
          } else {
            errorMessage = 'There was an error in the registration, please check the fields and try again.';
          }

          console.error('Error al enviar datos al servidor:', error);
        }
      }

    };


    const goLogin = () => {
      navigate("/login")
    }

    return (

      <div className="w-full h-full bg-black">
        <div className="flex justify-center items-center min-h-screen ml-10 bg-center bg-yellow-500/70 bg-custom-img" style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
        <div className="w-full max-w-full px-3 mx-auto mt-0 md:flex-0 shrink-0">
            <div className="flex flex-col gap-3 justify-center items-center px-3 mx-auto mt-0 md:flex-0 shrink-0">
              <div className="relative z-0 flex flex-col min-w-0 break-words bg-white bg-opacity-90 border-0 shadow-soft-xl rounded-2xl bg-clip-border p-10">
                <div className="p-6 mb-0 text-center border-b-0 rounded-t-2xl ">
                  <h5 className="text-center text-4xl font-bold leading-9 tracking-tight text-gray-800">Register</h5>
                </div>
                <div className="flex flex-wrap px-3 -mx-3 sm:px-6 xl:px-12">
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 mb-4">
                    <label className="text-gray-800" htmlFor="name">Name</label>
                    <Input onChange={handleInputChange} id="name" placeholder="Enter your name" type="name" name="name" />
                    {errors.UserName && <p className="text-red-500 text-sm mt-1">{errors.UserName}</p>}
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 mb-4">
                    <label className="text-gray-800" htmlFor="email">Email</label>
                    <Input onChange={handleInputChange} id="email" placeholder="Enter your email" type="email" name="email" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 mb-4">
                    <label className="text-gray-800" htmlFor="password">Password</label>
                    <Input onChange={handleInputChange} id="password" placeholder="Enter your password" type="password" name="password" />
                    {errors.Password && <p className="text-red-500 text-sm mt-1">{errors.Password}</p>}
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 mb-4">
                    <label className="text-gray-800" htmlFor="confirmPassword">Confirm Password</label>
                    <Input onChange={handleInputChange} id="confirmPassword" placeholder="Confirm your password" type="password" name="confirmPassword" />
                    {errors.ConfirmPassword && <p className="text-red-500 text-sm mt-1">{errors.ConfirmPassword}</p>}
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 mb-4">
                    <label className="text-gray-800" htmlFor="phone">Phone</label>
                    <Input onChange={handleInputChange} id="phone" placeholder="Enter your phone" type="phone" name="phone" />
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 mb-4">
                    <label className="text-gray-800" htmlFor="address">Address</label>
                    <Input onChange={handleInputChange} id="address" placeholder="Enter your address" type="address" name="address" />
                  </div>
                  <div className="text-center relative w-full">
                    <button onClick={handleSubmit} type="submit" className="w-full bg-yellow-500 text-white p-3 rounded-md focus:outline-none hover:bg-yellow-600">
                      <span className="text-white hover:text-black">Sign up</span>
                    </button>
                  </div>
                  <p className="mt-4 mb-0 leading-normal text-gray-800 text-sm">Don't have an account? <a className="font-bold cursor-pointer text-yellow-500 hover:text-yellow-700">Log in</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  };


  export default SignUp; */

  import axios from "axios";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { useDispatch } from 'react-redux';
  import { useSelector } from "react-redux/es/hooks/useSelector";
  import { getParamsEnv } from "../functions/getParamsEnv";
  import Input from "../ui_bodega/Input";
  import image1 from './../assets/image1.jpg';
  
  const { API_URL_BASE } = getParamsEnv();
  
  const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})
  
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
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
  
      console.log("Esto es formData: ", formData)
  
      if (validateForm()) {
        try {
          const response = await axios.post(`${API_URL_BASE}/api/auth/register`, formData);
          console.log(response.data)
  
          if (response.data.data.created === 'ok') {
            console.log("Succes at create user")
            navigate('/login');
          }
        } catch (error) {
          let errorMessage = '';
          if (error.response.data.message === 'llave duplicada viola restricción de unicidad «users_Email_key»') {
            errorMessage = 'Email already in use';
          } else if (error.response.data.message === 'llave duplicada viola restricción de unicidad «users_UserName_key»') {
            errorMessage = 'UserName already in use';
          } else if (error.response.data.message === 'llave duplicada viola restricción de unicidad «users_Phone_key»') {
            errorMessage = 'Phone already in use';
          } else {
            errorMessage = 'There was an error in the registration, please check the fields and try again.';
          }
          console.error('Error al enviar datos al servidor:', error);
        }
      }
    };
  
    const goLogin = () => {
      navigate("/login")
    }
  
    return (
      <div className="w-full h-full bg-gray-800">
        <div className="flex justify-center items-center min-h-screen ml-10 bg-cover bg-gray-800" style={{ backgroundImage: `url(${image1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="w-full max-w-full px-3 mx-auto mt-0 md:flex-0 shrink-0">
            <div className="flex flex-col gap-3 justify-center items-center px-3 mx-auto mt-0 md:flex-0 shrink-0">
              <div className="relative z-0 flex flex-col min-w-0 break-words bg-white bg-opacity-90 border-0 shadow-soft-xl rounded-2xl bg-clip-border p-10">
                <div className="p-6 mb-0 text-center border-b-0 rounded-t-2xl ">
                  <h5 className="text-center text-4xl font-bold leading-9 tracking-tight text-gray-800">Register</h5>
                </div>
                <div className="flex flex-wrap px-3 -mx-3 sm:px-6 xl:px-12">
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 mb-4">
                    <label className="text-gray-800" htmlFor="name">Name</label>
                    <Input onChange={handleInputChange} id="name" placeholder="Enter your name" type="name" name="name" />
                    {errors.UserName && <p className="text-red-500 text-sm mt-1">{errors.UserName}</p>}
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 mb-4">
                    <label className="text-gray-800" htmlFor="email">Email</label>
                    <Input onChange={handleInputChange} id="email" placeholder="Enter your email" type="email" name="email" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 mb-4">
                    <label className="text-gray-800" htmlFor="password">Password</label>
                    <Input onChange={handleInputChange} id="password" placeholder="Enter your password" type="password" name="password" />
                    {errors.Password && <p className="text-red-500 text-sm mt-1">{errors.Password}</p>}
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 mb-4">
                    <label className="text-gray-800" htmlFor="confirmPassword">Confirm Password</label>
                    <Input onChange={handleInputChange} id="confirmPassword" placeholder="Confirm your password" type="password" name="confirmPassword" />
                    {errors.ConfirmPassword && <p className="text-red-500 text-sm mt-1">{errors.ConfirmPassword}</p>}
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 mb-4">
                    <label className="text-gray-800" htmlFor="phone">Phone</label>
                    <Input onChange={handleInputChange} id="phone" placeholder="Enter your phone" type="phone" name="phone" />
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 px-3 mb-4">
                    <label className="text-gray-800" htmlFor="address">Address</label>
                    <Input onChange={handleInputChange} id="address" placeholder="Enter your address" type="address" name="address" />
                  </div>
                  <div className="text-center relative w-full">
                    <button onClick={handleSubmit} type="submit" className="w-full bg-yellow-500 text-white p-3 rounded-md focus:outline-none hover:bg-yellow-600">
                      <span className="text-white hover:text-black">Sign up</span>
                    </button>
                  </div>
                  <p className="mt-4 mb-0 leading-normal text-gray-800 text-sm">Don't have an account? <a className="font-bold cursor-pointer text-yellow-500 hover:text-yellow-700">Log in</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SignUp;