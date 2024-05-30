import React, { useState } from 'react';
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useSelector } from 'react-redux';
import Modal from './Modal';
import CartView from './cartView/CartView';
import { LiaCartPlusSolid } from "react-icons/lia";


const CartIcon = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const cartItems = useSelector((state) => state?.cart);

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    // Si no hay elementos en el carrito, no se muestra el icono del carrito
    if (cartItems.length === 0) {
        return null;
    }

    return (
    <div className='cursor-pointer'>
      <div onClick={openModal}>
        <div className='hidden sm:flex flex gap-2 items-center rounded-lg  bg-blue-600 '>
          <LiaCartPlusSolid className='w-6 h-6 sm:w-8 sm:h-8 text-white ml-2' />
          <p className='text-base text-white font-bold sm:text-xl sm:  rounded-full w-10 h-10 flex items-center justify-center'>
            {cartItems.length}
          </p>
        </div>

        <div className='flex sm:hidden flex gap-2 items-center rounded-lg  '>
          <LiaCartPlusSolid className='w-6 h-6 sm:w-8 sm:h-8 text-black ' />
          
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <CartView onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default CartIcon;