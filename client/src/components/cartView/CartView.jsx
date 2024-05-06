import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/actions/actions';
import { getParamsEnv } from '../../functions/getParamsEnv';
import axios from 'axios';

const {API_URL_BASE} = getParamsEnv()

const CartView = ({onClose}) => {
    const cartItems = useSelector((state) => state.cart);
    const user = useSelector((state) => state.client.client)
    console.log(user)
    const [itemQuantities, setItemQuantities] = useState({});
    const dispatch = useDispatch()

    // Agrupar productos y contar la cantidad de cada uno
    const groupedItems = cartItems.reduce((acc, item) => {
        if (!acc[item.id]) {
            acc[item.id] = { ...item, quantity: 0 };
        }
        acc[item.id].quantity++;
        return acc;
    }, {});

    // Función para actualizar la cantidad de un producto en el carrito
    const addItemTocart = (item) => {
        
        dispatch(addToCart(item))
    }

    const removeItemFromCart = (itemId) => {
        console.log("remove1")
        dispatch(removeFromCart(itemId))

    }
    // Calcular la suma total final
    const total = Object.values(groupedItems).reduce((acc, item) => {
        return acc + (item.price * (itemQuantities[item.id] || item.quantity));
    }, 0);

    const handlePayment = async () => {

        const products = cartItems
        const customerInfo = { name: user.name, mail: user.mail, id: user.id }

        try {
            const response = await axios.post(`${API_URL_BASE}/api/payment/distPayment`, {products, customerInfo })
            if ( response.statusText === "OK") {
                window.location.href = response.data.url
                onClose()
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex min-w-[500px] justify-center items-center">
            <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                {cartItems.length > 0 ? (
                    <div>
                        {Object.values(groupedItems).map((item) => (
                            <div key={item.id} className="flex items-center border-b py-2">
                                <img className="w-20 h-20 mr-4 rounded-lg" src={item.image1} alt={item.name} />
                                <div>
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">${item.price}</p>
                                    <div className="flex items-center">
                                        <button
                                            className="mr-2 text-gray-600 focus:border-yellow-600"
                                            onClick={() => removeItemFromCart(item.id)}
                                            disabled={(itemQuantities[item.id] || item.quantity) <= 0}
                                        >
                                            -
                                        </button>
                                        <p className="text-black font-bold">x{itemQuantities[item.id] || item.quantity}</p>
                                        <button
                                            className="ml-2 text-gray-600 focus:border-yellow-600"
                                            onClick={() => addItemTocart(item)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 ml-auto">${item.price * (itemQuantities[item.id] || item.quantity)}</p>
                            </div>
                        ))}
                        <div className="mt-4">
                            <p className="text-lg font-semibold">Total: ${total}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Your cart is empty</p>
                )}
                <div className="mt-4">
                    <span onClick={handlePayment} className="cursor-pointer bg-black hover:bg-yellow-600 focus:border-yellow-600 text-yellow-600 hover:text-black font-bold font-semibold py-2 px-4 rounded">
                        Checkout
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CartView;