import React from 'react';
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CartIcon = () => {

    const cartItems = useSelector((state) => state?.cart)
    console.log(cartItems)
    const navigate = useNavigate()

    const goToCart = () => {
        navigate('/cartView')
    }

  return (
    <div onClick={goToCart} className='cursor-pointer mt-20 w-[100px] h-screen' style={{ position: 'fixed', top: '3%', left: '80%' }}>
      <div className='p-2 flex gap-6 rounded-lg bg-black'>
        <ShoppingCartIcon className='w-8 h-8 text-yellow-600' />
        <p className='text-xl text-yellow-600 font-bold mt-1'>2</p>
      </div>
    </div>
  );
}

export default CartIcon;