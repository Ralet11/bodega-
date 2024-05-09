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
        <div>
            <div onClick={openModal} className='cursor-pointer mt-20 w-[100px] ' style={{ position: 'fixed', top: '2.5%', left: '80%' }}>
                <div className='p-2 flex gap-6 rounded-lg bg-black'>
                    <ShoppingCartIcon className='w-8 h-8 text-yellow-600' />
                    <p className='text-xl text-yellow-600 font-bold mt-1'>{cartItems.length}</p>
                </div>
            </div>
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <CartView onclose={closeModal} />
                </Modal>
            )}
        </div>
    );
}

export default CartIcon;