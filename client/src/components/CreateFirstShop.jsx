import React, { useEffect, useState } from 'react';
import Header from './header/Header';
import axios from 'axios';
import { getParamsEnv } from '../functions/getParamsEnv';
import { useDispatch, useSelector } from 'react-redux';
import { changeShop, setClientLocals } from '../redux/actions/actions';
import { useNavigate } from 'react-router-dom';

import Input from "../ui_bodega/Input";

const { API_URL_BASE } = getParamsEnv();

const CreateFirstShop = () => {
  const client = useSelector((state) => state?.client.client);
  const token = useSelector((state) => state?.client.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [locals, setLocals] = useState(null);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    lat: 85.65,
    lng: 60.45,
    category: '',  // Añadido campo de categoría
    clientId: client.id || ""
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/api/locals_categories/getAll`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL_BASE}/api/local/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);

      if (response.data.created === "ok") {
        const fetchLocals = async () => {
          try {
            if (!token) {
              throw new Error('No token found');
            }

            const response = await axios.get(`${API_URL_BASE}/api/local/getByClient`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.data.finded === "ok") {
              console.log(response.data.locals);
              dispatch(setClientLocals(response.data.locals));
            }
          } catch (error) {
            console.error('Error fetching locals:', error);
          }
        };

        fetchLocals();
      
        dispatch(changeShop(response.data.result.id));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Error creating shop:', error);
      alert('Error creating shop');
    }
  };

  return (
    <>
      <Header />

      <div className='flex justify-center items-center min-h-screen bg-gray-100  bg-custom-img-2' style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
        <div className='w-full max-w-md p-8 bg-black rounded-md shadow-md bg-black bg-opacity-20' >
          <h1 className='text-2xl font-bold mb-6 text-center text-white'>Create Your First Shop</h1>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label htmlFor='name' className='block  text-white'>Name:</label>
              <Input onChange={handleChange} id="name" placeholder="Enter your name" type="name" name="name" />
            </div>
            <div className='mb-4'>
              <label htmlFor='address' className='text-white  '>Address:</label>
              <Input onChange={handleChange} id="address" placeholder="Enter your address" type="address" name="address" />
            </div>
            <div className='mb-4'>
              <label htmlFor='phone' className='text-white '>Shop phone:</label>
              <Input onChange={handleChange} id="phone" placeholder="Enter your phone" type="phone" name="phone" />
            </div>
            <div className='mb-4'>
              <label htmlFor='category' className='text-white'>Category:</label>
              <select id="category" name="category" onChange={handleChange} className="form-select px-2 mb-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 sm:text-sm sm:leading-6">
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <button type='submit' className='w-full bg-yellow-500 text-white p-3 rounded-md focus:outline-none hover:bg-indigo-600'>Create Shop</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateFirstShop;
