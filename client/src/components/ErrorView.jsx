import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gray-100'>
      <div className='text-center'>
        <h1 className='text-9xl font-extrabold text-gray-800 mb-4'>
          <span className='text-yellow-400 drop-shadow-lg'>4</span>
          <span className='text-black drop-shadow-lg'>0</span>
          <span className='text-yellow-400 drop-shadow-lg'>4</span>
        </h1>
        <p className='text-2xl text-gray-600 my-4'>Oops! The page you are looking for does not exist.</p>
        <button 
          className='mt-6 px-6 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition duration-300'
          onClick={handleGoBack}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
