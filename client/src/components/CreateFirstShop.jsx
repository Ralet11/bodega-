import React, { useState } from 'react';
import Header from './header/Header';
import axios from 'axios';
import { getParamsEnv } from '../functions/getParamsEnv';
import { useDispatch, useSelector } from 'react-redux';
import { changeShop } from '../redux/actions/actions';
import { useNavigate } from 'react-router-dom';

import Input from "../ui_bodega/Input";


const {API_URL_BASE} = getParamsEnv()

const CreateFirstShop = () => {

    const client = useSelector((state) => state?.client.client)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [clientId, setClientId] = useState(null)
    console.log(client)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    lat: 85.65,
    lng: 60.45,
    clientId: client.id || ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL_BASE}/api/local/add`, formData); // Assuming the endpoint to create a shop is '/api/shops'
      console.log(response.data)
      if (response.data.created === "ok") {
      
        dispatch(changeShop(response.data.result.id))
        navigate("/dashboard")

        /* try {
            const response = await axios.get(`${API_URL_BASE}/api/clients/${clientID}`)
            console.log(response)

             dispatch(changeShop(response.data.result.id))
            navigate("/dashboard") 
        } catch (error) {
            console.log(error)
        } */
      }
    } catch (error) {
      console.error('Error creating shop:', error);
      alert('Error creating shop');
    }
  };

  return (
    <>
      <Header />

      <div className='flex justify-center items-center min-h-screen bg-yellow-400 bg-custom-img-2' style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
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
              <label htmlFor='phone' className='text-white '>Phone:</label>
              <Input onChange={handleChange} id="phone" placeholder="Enter your phone" type="phone" name="phone" />
            
            </div>
            <div className='mb-6'>
              <label htmlFor='category' className='text-white  '>Category:</label>
              <Input onChange={handleChange} id="category" placeholder="Enter your category" type="category" name="category" />
            </div>
            <button type='submit' className='w-full bg-yellow-500 text-white p-3 rounded-md focus:outline-none hover:bg-indigo-600'>Create Shop</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateFirstShop;