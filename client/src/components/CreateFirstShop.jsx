import React, { useState } from 'react';
import Header from './header/Header';
import axios from 'axios';
import { getParamsEnv } from '../functions/getParamsEnv';
import { useDispatch, useSelector } from 'react-redux';
import { changeShop } from '../redux/actions/actions';
import { useNavigate } from 'react-router-dom';

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
      <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 bg-white rounded-md shadow-md'>
          <h1 className='text-2xl font-bold mb-6 text-center'>Create Your First Shop</h1>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label htmlFor='name' className='block text-gray-700'>Name:</label>
              <input type='text' id='name' name='name' value={formData.name} onChange={handleChange} className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' />
            </div>
            <div className='mb-4'>
              <label htmlFor='address' className='block text-gray-700'>Address:</label>
              <input type='text' id='address' name='address' value={formData.address} onChange={handleChange} className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' />
            </div>
            <div className='mb-4'>
              <label htmlFor='phone' className='block text-gray-700'>Phone:</label>
              <input type='text' id='phone' name='phone' value={formData.phone} onChange={handleChange} className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' />
            </div>
            <div className='mb-6'>
              <label htmlFor='category' className='block text-gray-700'>Category:</label>
              <input type='text' id='category' name='category' value={formData.category} onChange={handleChange} className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' />
            </div>
            <button type='submit' className='w-full bg-indigo-500 text-white p-3 rounded-md focus:outline-none hover:bg-indigo-600'>Create Shop</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateFirstShop;