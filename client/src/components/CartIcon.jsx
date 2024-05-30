import React, { useState } from 'react';
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

    if (cartItems.length === 0) {
        return null;
    }

    return (
        <div className='relative cursor-pointer'>
            <div onClick={openModal} className='relative'>
                <LiaCartPlusSolid className='ml-2 w-6 h-6 md:w-8 md:h-8 text-black' />
                <div className='absolute -top-2 -right-2 w-4 h-4 md:w-6 md:h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold'>
                    {cartItems.length}
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