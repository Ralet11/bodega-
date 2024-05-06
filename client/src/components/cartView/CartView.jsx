import React from 'react';
import { useSelect } from '@material-tailwind/react';
import { useSelector } from 'react-redux';

const CartView = () => {
    const cartItems = useSelector((state) => state.cart);

    // Creamos un objeto para almacenar la cantidad de cada producto
    const itemCounts = {};
    cartItems.forEach(item => {
        itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
    });

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                {cartItems.length > 0 ? (
                    <div>
                        {cartItems.map((item, index) => (
                            // Solo mostramos el producto si es el primero o no es igual al anterior
                            index === 0 || item.id !== cartItems[index - 1].id ? (
                                <div key={index} className="flex items-center border-b py-2">
                                    <img className="w-20 h-20 mr-4 rounded-lg" src={item.image1} alt={item.name} />
                                    <div>
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        <p className="text-gray-600">${item.price}</p>
                                        <p className="text-gray-500">{item.description}</p>
                                        {itemCounts[item.id] > 1 && (
                                            <p className="text-gray-500">Quantity: x{itemCounts[item.id]}</p>
                                        )}
                                    </div>
                                </div>
                            ) : null
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Your cart is empty</p>
                )}
                <div className="mt-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartView;