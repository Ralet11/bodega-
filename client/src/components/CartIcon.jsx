import React, { useState } from 'react';
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useSelector } from 'react-redux';
import Modal from './Modal';
import CartView from './cartView/CartView';

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
                <div className='p-2 flex gap-4 rounded-lg bg-black'>
                    <ShoppingCartIcon className='w-6 h-6 text-yellow-600 sm:w-8 sm:h-8' />
                    <p className='text-base text-yellow-600 font-bold mt-1 sm:text-xl'>{cartItems.length}</p>
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